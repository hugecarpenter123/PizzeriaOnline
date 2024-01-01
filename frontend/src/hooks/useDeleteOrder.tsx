import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext, UserDetails, UserReview } from '../contexts/AppContext';
import useFetchUserOrders from './useFetchUserOrders';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../screens/AppStacks';
import useErrorInterceptor from './UseErrorInterceptor';
import { InternalAppCode } from '../utils/StaticAppInfo';

type DeleteOrderHookResult = {
    loading: boolean,
    success: boolean,
    error: string | null,
    deleteOrder: (id: number) => void,
}

const useDeleteOrder = (): DeleteOrderHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token, logout } = useContext(AppContext);
    const { fetchUserOrders } = useFetchUserOrders();

    const { errorInterceptor } = useErrorInterceptor();
    const internalAppCodeRef = useRef<InternalAppCode | null>(null);
    const dataCopyRef = useRef<number | null>(null);

    useEffect(() => {
        if (internalAppCodeRef.current === InternalAppCode.ACCESS_TOKEN_EXPIRED) {
            deleteOrder(dataCopyRef.current as number);
            internalAppCodeRef.current = null;
            dataCopyRef.current = null;
        }
    }, [token])

    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
        else if (success) {
            updateContext();
            showToast("Pomyślnie anulowano zamówienie", 0);
        }
    }, [error, success]);

    const updateContext = () => {
        fetchUserOrders();
    }

    const deleteOrder = async (id: number): Promise<void> => {
        try {
            dataCopyRef.current = id;
            setLoading(true);
            setError(null);
            const url = `${ApiUrls.CANCEL_ORDER}/${id}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                // Handle error response with status code 4xx
                const errorMessage = response?.headers?.get('Content-Type')?.includes('application/json')
                    ? await response.json().then((data) => data.message || data)
                    : response.status;
                throw new Error(errorMessage);
            }

            // here reponse is ok
            console.log("Order cancelled seccessfully!");
            setSuccess(true);
        } catch (error: any) {
            console.log("catch block: " + error)

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

    return { loading, success, error, deleteOrder };
}

export default useDeleteOrder;