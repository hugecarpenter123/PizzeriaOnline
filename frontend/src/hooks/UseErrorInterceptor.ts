import { useContext } from 'react';
import useExchangeTokens from "./useExchangeTokens";
import { InternalAppCode } from "../utils/StaticAppInfo";
import { AppContext } from '../contexts/AppContext';
import ForceLogout from '../utils/ForceLogout';


type ErrorInterceptorType = (
    internalAppCode: InternalAppCode,
    setError: React.Dispatch<React.SetStateAction<string | null>>
) => Promise<void>

type ErrorInterceptorHookResult = {
    errorInterceptor: ErrorInterceptorType
}

const useErrorInterceptor = (): ErrorInterceptorHookResult => {
    const { exchangeTokens, loading, error, success } = useExchangeTokens();

    const errorInterceptor: ErrorInterceptorType = async (internalAppCode, setError) => {
        switch (internalAppCode) {
            case InternalAppCode.ACCESS_TOKEN_EXPIRED:
                exchangeTokens();
                break;
            case InternalAppCode.BAD_ACCESS_TOKEN:
                setError("Sesja wygasła, zaloguj się ponownie")
                ForceLogout();
                break;
            case InternalAppCode.BAD_REFRESH_TOKEN:
                setError("Sesja wygasła, zaloguj się ponownie")
                ForceLogout();
                break;
            case InternalAppCode.REFRESH_TOKEN_EXPIRED:
                setError("Sesja wygasła, zaloguj się ponownie")
                ForceLogout();
                break;
            case InternalAppCode.NO_ADMIN_PERMS:
                break;
            case InternalAppCode.NO_USER_PERMS:
                break;
            case InternalAppCode.BAD_CREDENTIALS:
                setError("Nieprawidłowe dane uwierzytelniające")
                break;
        }
    }

    return { errorInterceptor };
}

export default useErrorInterceptor;