import React, { useState, useContext } from "react";
import { RegistrationData } from '@/lib/types'
import { ApiUrls } from "@/lib/urls"
import { AppContext } from "@/contexts/app-context"
import { InternalAppCode } from "@/lib/static-app-info"
import FetchError from "@/lib/FetchError";
import useErrorInterceptor from "./useErrorInterceptor";
import Timeout from "@/lib/timeout";

type RegisterHookResult = {
    loading: boolean;
    success: boolean;
    error: string | null;
    register: (data: RegistrationData) => void;
};

const useRegister = (): RegisterHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { errorInterceptor } = useErrorInterceptor();


    const register = async (data: RegistrationData): Promise<void> => {
        let errorMessage = null;
        let internalAppCode = null;
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const payload = JSON.stringify(data);
            const { timeoutId, controller } = Timeout();
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

export default useRegister;