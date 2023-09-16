import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext, UserDetails, UserReview } from '../contexts/AppContext';
import useFetchUserOrders from './useFetchUserOrders';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../screens/AppStacks';
import { InternalAppCode } from '../utils/StaticAppInfo';
import ForceLogout from '../utils/ForceLogout';
import useErrorInterceptor from './UseErrorInterceptor';

type DeleteAccountHookResult = {
    loading: boolean,
    success: boolean,
    error: string | null,
    deleteAccount: () => void,
}

const useDeleteAccount = (): DeleteAccountHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useContext(AppContext);

    const { errorInterceptor } = useErrorInterceptor();
    const internalAppCodeRef = useRef<InternalAppCode | null>(null);

    useEffect(() => {
        if (internalAppCodeRef.current === InternalAppCode.ACCESS_TOKEN_EXPIRED) {
            deleteAccount();
            internalAppCodeRef.current = null;
        }
    }, [token])

    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
        else if (success) {
            showToast("Pomyślnie usunięto konto", 0);
            ForceLogout();
        }
    }, [error, success]);

    const deleteAccount = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const url = `${ApiUrls.DELETE_USER}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

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
            console.log("User account deleted seccessfully!");
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

    return { loading, success, error, deleteAccount };
}

export default useDeleteAccount;