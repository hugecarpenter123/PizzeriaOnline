import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import FetchError from '../utils/Errors/FetchError';
import { InternalAppCode } from '../utils/StaticAppInfo';
import showToast from '../utils/showToast';
import useErrorInterceptor from './useErrorInterceptor';
import { Order } from '../utils/AppTypes';
import { ApiUrls } from '../utils/urls';
import Timeout from '../utils/Timeout';

type OrderListenerResult = {
    loading: boolean,
    error: string | null,
    success: boolean,
    subscribe: (clb: (order: Order) => void) => void,
}

type CallbackArg = (order: Order) => void

// todo: trzeba zakutalizwać stan w kontekście aplikacji
const useOrdersListener = (): OrderListenerResult => {
    const { token } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { errorInterceptor } = useErrorInterceptor();

    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
    }, [error]);

    const subscribe = async (callbackArg: CallbackArg, newToken?: string): Promise<void> => {

        let internalAppCode = null;
        let errorMessage = null;

        setLoading(true);
        setError(null);
        const url = ApiUrls.GET_ORDER_EVENT_SUBSCRIPTION;
        const { timeoutId, controller } = Timeout();

        fetchEventSource(url, {
            headers: {
                'Authorization': `Bearer ${newToken ? newToken : token}`,
            },

            async onopen(response) {
                if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
                    console.log("successfully subscribed to orderListener")
                    return;
                } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {

                    // client-side errors are usually non-retriable:
                    internalAppCode = InternalAppCode.BAD_EVENT_RESPONSE
                    errorMessage = `event response status: ${response.status}, content-type: ${response.headers.get('content-type')}`
                    throw new FetchError({ internalAppCode, errorMessage })
                } else {
                    internalAppCode = InternalAppCode.BAD_EVENT_RESPONSE // do zmiany
                    errorMessage = `event response status: ${response.status}, content-type: ${response.headers.get('content-type')}`
                    throw new FetchError({ internalAppCode, errorMessage })
                }
            },
            onmessage(msg) {
                console.log(`onmessage(msg): \n\t-msg.event: ${msg.event}\n\t-msg.data: ${JSON.stringify(msg.data)}\n\t-msg.id: ${msg.id}`)
                if (msg.event === "orderEvent") {
                    // all fine, main logic there ---------------
                    const order = JSON.parse(msg.data);
                    console.log("parsed order data: " + order)
                    console.log("stringified order data: " + JSON.stringify(order));

                    // updateNewOrdersStateCallback()
                }

                if (msg.event === 'FatalError') {
                    internalAppCode = InternalAppCode.EVENT_MESSAGE_ERROR // do zmiany
                    errorMessage = "msg.event returned: FatalError"
                    throw new FetchError({ internalAppCode, errorMessage })
                }
            },
            onclose() {
                console.log("onClose()")
                // if the server closes the connection unexpectedly, retry:
                internalAppCode = InternalAppCode.UNDEFINED_ERROR // RetriableError
                errorMessage = "event closed"
                throw new FetchError({ internalAppCode, errorMessage })
            },
            onerror(error: any) {
                const internalAppCode = error instanceof FetchError
                    ? error.internalAppCode
                    : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

                const errorMessage = error instanceof FetchError
                    ? error.message
                    : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

                console.error(`InernalAppCode: ${internalAppCode}`);
                console.error(`fetchUserOrders error: ${errorMessage}`);
                const callback = (newToken: string) => subscribe(callbackArg, newToken)

                errorInterceptor(internalAppCode, setError, setLoading, callback);
            },
        });

    };

    return { loading, error, success, subscribe };
}

export default useOrdersListener;