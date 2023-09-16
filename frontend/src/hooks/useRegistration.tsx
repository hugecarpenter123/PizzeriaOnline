import React, { useState, useEffect, useRef } from "react";
import { RegistrationData } from "../screens/RegistrationScreen";
import { ApiUrls } from "../utils/urls";
import showToast from "../utils/showToast";
import useErrorInterceptor from "./UseErrorInterceptor";
import { InternalAppCode } from "../utils/StaticAppInfo";

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
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            const payload = JSON.stringify(data);

            const response = await fetch(ApiUrls.POST_REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: payload,
            })

            if (!response.ok) {
                // status code: 4xx, check for messages, if no then display status code
                const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');
                const body = containsJson ? await response.json() : null;
                const errorMessage = containsJson ? body.message || body : response.status;
                internalAppCodeRef.current = containsJson ? body.internalAppCode : null
                throw new Error(errorMessage);
            }

        } catch (error: any) {
            console.log("catch block: " + error)

            if (internalAppCodeRef.current) {
                errorInterceptor(internalAppCodeRef.current, setError);
            }
            else {
                setError("Wydarzył się nieoczekiwany błąd, spróbuj ponownie później")
            }
        } finally {
            setLoading(false);
        }

    };

    return { loading, success, error, register };
};

export default useRegistration;