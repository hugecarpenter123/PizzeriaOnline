import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext, UserDetails, UserReview } from '../contexts/AppContext';
import useFetchUserDetails from './useFetchUserDetails';
import { OrderPayloadModel } from '../screens/Cart/OrderCompletionScreen';
import { MainScreenContext } from '../contexts/MainScreenContext';
import { InternalAppCode } from '../utils/StaticAppInfo';
import useExchangeTokens from './useExchangeTokens';
import useErrorInterceptor from './UseErrorInterceptor';

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


    const internalAppCodeRef = useRef<InternalAppCode | null>(null);
    const dataCopyRef = useRef<OrderPayloadModel | null>(null);

    // handle error and success
    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
        else if (success) {
            showToast("Pomyślnie dodano zamówienie", 0);
        }
    }, [error, success]);

    // retry mechanism
    useEffect(() => {
        if (internalAppCodeRef.current && dataCopyRef.current) {
            // console.log(`now retry function should happen with this token: \n${token}\ncode: ${internalAppCodeRef.current}\ndataCopy: ${JSON.stringify(dataCopyRef.current)}`);
            addOrder(dataCopyRef.current)
            dataCopyRef.current = null;
            internalAppCodeRef.current = null;
        } else {
            console.log("Token changed but no retry");
        }
    }, [token])

    const updateContext = () => {
        // update userDetails - which contain Orders
        updateUserDetails();
        clearCart();
    }

    const addOrder = async (data: OrderPayloadModel): Promise<void> => {
        try {
            dataCopyRef.current = data;
            setLoading(true);
            setError(null);
            
            const url = `${ApiUrls.POST_ORDER}`;

            const headers: { [key: string]: string } = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
            });

            console.log("response: ")
            console.log(response);

            if (!response.ok) {
                // Handle error response with status code 4xx
                const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');
                const body = containsJson ? await response.json() : null;

                const errorMessage = containsJson
                    ? body.message || body
                    : response.status;

                const internalCode = containsJson
                    ? body.internalAppCode
                    : null

                internalAppCodeRef.current = internalCode;
                throw new Error(errorMessage);
            }

            // here reponse is ok
            console.log("Order added successfully!");
            setSuccess(true);
            updateContext();

        } catch (error: any) {
            console.error(error.message)
            if (internalAppCodeRef.current) {
                errorInterceptor(internalAppCodeRef.current, setError);
            }

        } finally {
            // if token needs to be refreshed then loading indicator should keep on spinning
            if (internalAppCodeRef.current !== InternalAppCode.ACCESS_TOKEN_EXPIRED) {
                setLoading(false);
            }
        }

    };

    return { loading, success, error, addOrder };
}

export default useCreateOrder;