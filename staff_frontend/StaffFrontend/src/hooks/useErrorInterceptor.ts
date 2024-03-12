import { useContext } from 'react';
import { InternalAppCode } from "../utils/StaticAppInfo";
import { AppContext } from '../contexts/AppContext';
import useForceLogout from './useForceLogout';
import exchangeToken from '../utils/exchangeToken';


type ErrorInterceptorProps = (
    internalAppCode: InternalAppCode,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    retryFetchCallback?: (token: string) => void
) => Promise<void>

type ErrorInterceptorHookResult = {
    errorInterceptor: ErrorInterceptorProps
}

const useErrorInterceptor = (): ErrorInterceptorHookResult => {
    const { refreshToken, setToken } = useContext(AppContext);
    const forceLogout = useForceLogout();

    const errorInterceptor: ErrorInterceptorProps = async (internalAppCode, setError, setLoading, retryFetchCallback) => {
        console.log(`Error interceptor called internalAppCode: ${internalAppCode}`);
        switch (internalAppCode) {
            case InternalAppCode.ACCESS_TOKEN_EXPIRED:
                if (refreshToken) {
                    try {
                        const newToken = await exchangeToken(refreshToken);
                        setToken(newToken);
                        retryFetchCallback && retryFetchCallback(newToken);
                    } catch (error: any) {
                        const internalAppCode = error.internalAppCode;
                        const errorMessage = error.errorMessage;
                        console.error(`Podczas wymiany tokenów wydarzył się błąd: \n${errorMessage}`);
                        errorInterceptor(internalAppCode, setError, setLoading, retryFetchCallback)
                    }

                } else {
                    console.error("RefreshToken nie istnieje, nie można wymienić Tokenu dostępu")
                    setError("Coś poszło nie tak, zgłoś problem")
                    setLoading(false);
                    forceLogout();
                }
                break;
            case InternalAppCode.BAD_ACCESS_TOKEN:
                setError("Sesja wygasła, zaloguj się ponownie")
                setLoading(false);
                forceLogout();
                break;
            case InternalAppCode.BAD_REFRESH_TOKEN:
                setError("Sesja wygasła, zaloguj się ponownie")
                setLoading(false);
                forceLogout();
                break;
            case InternalAppCode.REFRESH_TOKEN_EXPIRED:
                setError("Sesja wygasła, zaloguj się ponownie")
                setLoading(false);
                forceLogout();
                break;
            case InternalAppCode.NO_ADMIN_PERMS:
                setError("Coś poszło nie tak, zgłoś problem")
                setLoading(false);
                break;
            case InternalAppCode.NO_USER_PERMS:
                setError("Coś poszło nie tak, zgłoś problem")
                setLoading(false);
                break;
            case InternalAppCode.BAD_CREDENTIALS:
                setLoading(false);
                setError("Nieprawidłowe dane uwierzytelniające")
                break;
            case InternalAppCode.BAD_JSON_RESPONSE:
                setLoading(false);
                setError("Wydarzył się niezdefiniowany błąd, spróbuj ponownie później")
                break;
            case InternalAppCode.UNDEFINED_ERROR:
                setLoading(false);
                setError("Wydarzył się niezdefiniowany błąd, spróbuj ponownie później")
                break;
            case InternalAppCode.REQUEST_TIMED_OUT:
                setLoading(false);
                setError("Czas oczekiwania na odpowiedź serwera przekroczony")
                break;
            default:
                setLoading(false);
                setError("Wydarzył się niezdefiniowany błąd, spróbuj ponownie później")
                break;
        }
    }

    return { errorInterceptor };
}

export default useErrorInterceptor;