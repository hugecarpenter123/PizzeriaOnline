import React, { useState, useEffect, useRef } from "react";
import { RegistrationData } from "../screens/RegistrationScreen";
import { ApiUrls } from "../utils/urls";
import showToast from "../utils/showToast";
import useErrorInterceptor from "./useErrorInterceptor";
import { InternalAppCode } from "../utils/StaticAppInfo";
import FetchError from "../utils/Errors/FetchError";
import timeout from "../utils/Timeout";

type RegistrationHookResult = {
    loading: boolean;
    success: boolean;
    error: string | null;
    register: (data: RegistrationData) => void;
};

/**
 * This hook organizes post request to server with registration data along with toasting the success and failure and
 * managing the state of the loading.
 */
const useRegistration = (): RegistrationHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { errorInterceptor } = useErrorInterceptor();
    const internalAppCodeRef = useRef<InternalAppCode | null>(null);

    const register = async (data: RegistrationData): Promise<void> => {
        let errorMessage = null;
        let internalAppCode = null;
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const payload = JSON.stringify(data);
            const { timeoutId, controller } = timeout();
            const response = await fetch(ApiUrls.POST_REGISTER, {
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

        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`register error: ${errorMessage}`);
            errorInterceptor(internalAppCode, setError, setLoading)
        }

    };

    return { loading, success, error, register };
};

export default useRegistration;