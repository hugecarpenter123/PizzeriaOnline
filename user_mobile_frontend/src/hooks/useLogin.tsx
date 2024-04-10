import React, { useState, useContext } from "react";
import { ApiUrls } from "../utils/urls";
import { AppContext } from "../contexts/AppContext";
import { InternalAppCode } from "../utils/StaticAppInfo";
import FetchError from "../utils/Errors/FetchError";
import useErrorInterceptor from "./useErrorInterceptor";
import Timeout from "../utils/Timeout";

type LoginHookResult = {
    loading: boolean;
    success: boolean;
    error: string | null;
    loginRequest: (data: LoginData) => void;
};

type LoginData = {
    email: string,
    password: string,
}


const useLogin = (): LoginHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useContext(AppContext)
    const { errorInterceptor } = useErrorInterceptor();

    const loginRequest = async (data: LoginData): Promise<void> => {
        let internalAppCode = null;
        let errorMessage = null;

        try {
            setLoading(true);
            setError(null);

            const { timeoutId, controller } = Timeout();
            const payload = JSON.stringify(data);
            const response = await fetch(ApiUrls.POST_LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: payload,
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

            if (!response?.headers?.get('Content-Type')?.includes('application/json')) {
                errorMessage = "successfull request, but no JSON";
                internalAppCode = InternalAppCode.BAD_JSON_RESPONSE;
                throw new FetchError({ errorMessage, internalAppCode });
            }

            const responseData = await response.json();

            if (
                !responseData.hasOwnProperty('token') ||
                !responseData.hasOwnProperty('refreshToken') ||
                !responseData.hasOwnProperty('userDetails')
            ) {
                errorMessage = 'Invalid JSON response: "result" key is missing.';
                internalAppCode = InternalAppCode.BAD_JSON_RESPONSE;
                throw new FetchError({ errorMessage, internalAppCode });
            }

            const userDetails = responseData.userDetails;
            const token = responseData.token;
            const refreshToken = responseData.refreshToken;
            setSuccess(true);
            setLoading(false);
            login(token, refreshToken, userDetails)
            console.log("Successfully logged, tokens & userDetails assigned")

        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`login error: ${errorMessage}`);
            errorInterceptor(internalAppCode, setError, setLoading);
        }



    };

    return { loading, success, error, loginRequest };
};

export default useLogin;