import { useState, useEffect, useContext } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext } from '../contexts/AppContext';
import { UserOrder } from '../contexts/MainScreenContext';
import useErrorInterceptor from './useErrorInterceptor';
import { InternalAppCode } from '../utils/StaticAppInfo';
import FetchError from '../utils/Errors/FetchError';
import Timeout from '../utils/Timeout';

type FetchUserOrdersResult = {
    loading: boolean,
    error: string | null,
    userOrders: undefined | UserOrder[];
    fetchUserOrders: () => void,
}


// todo: trzeba zakutalizwać stan w kontekście aplikacji
const useFetchUserOrders = (): FetchUserOrdersResult => {
    const { token } = useContext(AppContext);
    // const { setUserOrders} = useContext(MainScreenContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userOrders, setUserOrders] = useState<undefined | UserOrder[]>(undefined);
    const { errorInterceptor } = useErrorInterceptor();

    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
    }, [error]);

    const fetchUserOrders = async (newToken?: string): Promise<void> => {
        let internalAppCode = null;
        let errorMessage = null;

        try {
            setLoading(true);
            setError(null);

            const { timeoutId, controller } = Timeout();

            const url = ApiUrls.GET_USER_ORDERS;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newToken ? newToken : token}`,
                },
                signal: controller.signal,
            })

            clearTimeout(timeoutId);

            if (!response.ok) {
                const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');
                const body = containsJson ? await response.json() : null;
                errorMessage = containsJson ? body.message || body : response.status;
                internalAppCode = containsJson ? body.internalAppCode : InternalAppCode.UNDEFINED_ERROR
                throw new FetchError({ errorMessage, internalAppCode });
            }

            // If response is empty throw
            if (!response?.headers?.get('Content-Type')?.includes('application/json')) {
                errorMessage = "successfull request, but no JSON";
                internalAppCode = InternalAppCode.BAD_JSON_RESPONSE;
                throw new FetchError({ errorMessage, internalAppCode });
            }

            // Parse the response data
            const responseData = await response.json();
            // Check if the response contains the expected "result" key
            if (!responseData.hasOwnProperty('result')) {
                errorMessage = 'Invalid JSON response: "result" key is missing.';
                internalAppCode = InternalAppCode.BAD_JSON_RESPONSE;
                throw new FetchError({ errorMessage, internalAppCode });
            }

            const result = responseData.result;
            // here all necessary data parsed successfully --------------------
            console.log("User orders fetched successfully");
            setUserOrders(result);
            setLoading(false);

        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`fetchUserOrders error: ${errorMessage}`);
            errorInterceptor(internalAppCode, setError, setLoading, fetchUserOrders);
        }

    };

    return { loading, error, fetchUserOrders, userOrders };
}

export default useFetchUserOrders;