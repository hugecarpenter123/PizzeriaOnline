import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext } from '../contexts/AppContext';
import { MainScreenContext } from '../contexts/MainScreenContext';
import useErrorInterceptor from './UseErrorInterceptor';
import { InternalAppCode } from '../utils/StaticAppInfo';

type FetchUserOrdersResult = {
    loading: boolean,
    success: boolean,
    error: string | null,
    fetchUserOrders: () => void,
}

const useFetchUserOrders = (): FetchUserOrdersResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setUserOrders } = useContext(MainScreenContext);
    const { token } = useContext(AppContext);
    const { errorInterceptor } = useErrorInterceptor();

    const internalAppCodeRef = useRef<InternalAppCode | null>(null);

    useEffect(() => {
        if (internalAppCodeRef.current === InternalAppCode.ACCESS_TOKEN_EXPIRED) {
            fetchUserOrders();
            internalAppCodeRef.current = null;
        }
    }, [token])

    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
    }, [error]);

    const fetchUserOrders = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const url = `${ApiUrls.GET_USER_ORDERS}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })

            if (!response.ok) {
                // Handle error response with status code 4xx
                const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');
                const body = containsJson ? await response.json() : null;
                const errorMessage = containsJson ? body.message || body : response.status;
                internalAppCodeRef.current = containsJson ? body.internalAppCode : null
                throw new Error(errorMessage);
            }

            // If response is empty, return null
            if (!response?.headers?.get('Content-Type')?.includes('application/json')) {
                console.log("successfull request - no JSON")
            } else {
                // Parse the response data
                const responseData = await response.json();
                // Check if the response contains the expected "result" key
                if (!responseData.hasOwnProperty('result')) {
                    throw new Error('Invalid response data: "result" key is missing.');
                } else {
                    const result = responseData.result;
                    // here all necessary data parsed successfully --------------------
                    console.log("User orders fetched successfully");
                    setUserOrders(result);
                    setSuccess(true);
                }
            }
        } catch (error: any) {
            console.error("catch block: " + error)
            if (internalAppCodeRef.current) {
                errorInterceptor(internalAppCodeRef.current, setError);
            }
            else {
                setError("Wydarzył się nieoczekiwany błąd, spróbuj ponownie później")
            }
        } finally {
            if (internalAppCodeRef.current !== InternalAppCode.ACCESS_TOKEN_EXPIRED) setLoading(false);
        }


    };

    return { loading, success, error, fetchUserOrders };
}

export default useFetchUserOrders;