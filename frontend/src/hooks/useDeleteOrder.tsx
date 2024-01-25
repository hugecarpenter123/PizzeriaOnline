import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext, UserDetails, UserReview } from '../contexts/AppContext';
import useFetchUserOrders from './useFetchUserOrders';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../screens/AppStacks';
import useErrorInterceptor from './useErrorInterceptor';
import { InternalAppCode } from '../utils/StaticAppInfo';
import FetchError from '../utils/Errors/FetchError';
import Timeout from '../utils/Timeout';

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

    const deleteOrder = async (id: number, newToken?: string): Promise<void> => {
        let internalAppCode = null;
        let errorMessage = null;

        try {
            setLoading(true);
            setError(null);

            const { timeoutId, controller } = Timeout();

            const url = `${ApiUrls.CANCEL_ORDER}/${id}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${newToken ? newToken : token}`,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');
                const body = containsJson ? await response.json() : null;
                errorMessage = containsJson ? body.message || body : response.status;
                internalAppCode = containsJson ? body.internalAppCode : InternalAppCode.UNDEFINED_ERROR
                throw new FetchError({ errorMessage, internalAppCode });
            }

            // here reponse is ok
            console.log("Order cancelled seccessfully!");
            setSuccess(true);
            setLoading(false);

        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`deleteOrder error: ${errorMessage}`);
            const callback = (newToken: string) => deleteOrder(id, newToken);
            errorInterceptor(internalAppCode, setError, setLoading, callback);
        }

    };

    return { loading, success, error, deleteOrder };
}

export default useDeleteOrder;