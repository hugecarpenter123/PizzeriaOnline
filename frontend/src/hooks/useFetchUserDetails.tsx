import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext } from '../contexts/AppContext';
import { InternalAppCode } from '../utils/StaticAppInfo';
import FetchError from '../utils/Errors/FetchError';
import useErrorInterceptor from './useErrorInterceptor';
import timeout from '../utils/Timeout';


type FetchUserDetailsResult = {
    loading: boolean,
    success: boolean,
    error: string | null,
    fetchUserDetails: () => void,
}

const useFetchUserDetails = (): FetchUserDetailsResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token, setUserDetails } = useContext(AppContext);
    const { errorInterceptor } = useErrorInterceptor();


    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
    }, [error]);

    const fetchUserDetails = async (newToken?: string): Promise<void> => {
        let internalAppCode = null;
        let errorMessage = null;
        try {
            setLoading(true);
            setError(null);
            const { timeoutId, controller } = timeout();
            const url = ApiUrls.GET_USER_DETAILS;
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

            // If response is empty, return null
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
            // all necessary data parsed successfully
            const result = responseData.result;
            console.log("UserDetails fetched successfully")
            setUserDetails(result);
            setLoading(false);
            setSuccess(true);


        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`fetchUserDetails error: ${errorMessage}`);
            errorInterceptor(internalAppCode, setError, setLoading, fetchUserDetails);
        }

    };

    return { loading, success, error, fetchUserDetails };
}

export default useFetchUserDetails;