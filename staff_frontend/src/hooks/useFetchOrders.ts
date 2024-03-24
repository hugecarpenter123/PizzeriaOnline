import React, { useState, useEffect, useContext } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext } from '../contexts/AppContext';
import useErrorInterceptor from './useErrorInterceptor';
import { InternalAppCode } from '../utils/StaticAppInfo';
import FetchError from '../utils/Errors/FetchError';
import Timeout from '../utils/Timeout';
import { Order } from '../utils/AppTypes';

type FetchOrdersArg = (orders: Order[]) => void;

type FetchOrdersResult = {
    loading: boolean,
    error: string | null,
    fetchOrders: (clb: FetchOrdersArg) => void,
}


// todo: trzeba zakutalizwać stan w kontekście aplikacji
const useFetchOrders = (): FetchOrdersResult => {
    const { token } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { errorInterceptor } = useErrorInterceptor();

    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
    }, [error]);

    const fetchOrders = async (stateChangeCallback: FetchOrdersArg, newToken?: string): Promise<void> => {
        let internalAppCode = null;
        let errorMessage = null;

        try {
            setLoading(true);
            setError(null);

            const { timeoutId, controller } = Timeout();

            const url = ApiUrls.GET_UNFINISHED_ODERS;
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
            setLoading(false);
            stateChangeCallback(result);

        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`fetchUserOrders error: ${errorMessage}`);

            const callback = (newToken: string) => fetchOrders(stateChangeCallback, newToken);
            errorInterceptor(internalAppCode, setError, setLoading, callback);
        }

    };

    return { loading, error, fetchOrders };
}

export default useFetchOrders;