import { useState, useEffect, useContext } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext } from '../contexts/AppContext';
import { InternalAppCode } from '../utils/StaticAppInfo';
import useForceLogout from './useForceLogout';
import useErrorInterceptor from './useErrorInterceptor';
import FetchError from '../utils/Errors/FetchError';
import Timeout from '../utils/Timeout';

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

    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
        else if (success) {
            showToast("Pomyślnie usunięto konto", 0);
            useForceLogout();
        }
    }, [error, success]);

    const deleteAccount = async (newToken?: string): Promise<void> => {
        let internalAppCode = null;
        let errorMessage = null;

        try {
            setLoading(true);
            setError(null);

            const { timeoutId, controller } = Timeout();

            const url = ApiUrls.DELETE_USER;
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
            console.log("User account deleted seccessfully!");
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
            console.error(`deleteAccount error: ${errorMessage}`);
            errorInterceptor(internalAppCode, setError, setLoading, deleteAccount);
        }

    };

    return { loading, success, error, deleteAccount };
}

export default useDeleteAccount;