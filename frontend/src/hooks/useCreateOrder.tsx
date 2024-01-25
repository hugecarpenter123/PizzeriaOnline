import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext, UserDetails, UserReview } from '../contexts/AppContext';
import useFetchUserDetails from './useFetchUserDetails';
import { OrderPayloadModel } from '../screens/Cart/OrderCompletionScreen';
import { MainScreenContext } from '../contexts/MainScreenContext';
import { InternalAppCode } from '../utils/StaticAppInfo';
import useErrorInterceptor from './useErrorInterceptor';
import FetchError from '../utils/Errors/FetchError';
import Timeout from '../utils/Timeout';
import { createAbstractBuilder } from 'typescript';

type PostOrderHookResult = {
    loading: boolean,
    success: boolean,
    error: string | null,
    addOrder: (data: OrderPayloadModel) => void,
}

const useCreateOrder = (): PostOrderHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useContext(AppContext);
    const { clearCart } = useContext(MainScreenContext);
    const { fetchUserDetails: updateUserDetails } = useFetchUserDetails();
    const { errorInterceptor } = useErrorInterceptor();

    // handle error and success
    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
        else if (success) {
            showToast("Pomyślnie dodano zamówienie", 0);
        }
    }, [error, success]);

    const updateContext = () => {
        // update userDetails - which contain Orders
        updateUserDetails();
        clearCart();
    }

    const addOrder = async (data: OrderPayloadModel, newToken?: string): Promise<void> => {
        let internalAppCode = null;
        let errorMessage = null;

        try {
            setLoading(true);
            setError(null)
            const { timeoutId, controller } = Timeout();

            const url = ApiUrls.POST_ORDER;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${newToken ? newToken : token}`,
                },
                body: JSON.stringify(data),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // Handle error response with status code 4xx
                const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');
                const body = containsJson ? await response.json() : null;

                errorMessage = containsJson
                    ? body.message || body
                    : response.status;

                internalAppCode = containsJson
                    ? body.internalAppCode
                    : InternalAppCode.UNDEFINED_ERROR;

                internalAppCode = containsJson ? body.internalAppCode : InternalAppCode.UNDEFINED_ERROR
                throw new FetchError({ errorMessage, internalAppCode });
            }

            // here reponse is ok
            console.log("Order added successfully!");
            setSuccess(true);
            setLoading(false);
            updateContext();

        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`createOrder error: ${errorMessage}`);
            const callback = (newToken: string) => addOrder(data, newToken);
            errorInterceptor(internalAppCode, setError, setLoading, callback);
        }

    };

    return { loading, success, error, addOrder };
}

export default useCreateOrder;