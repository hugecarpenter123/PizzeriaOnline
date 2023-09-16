import React, { useState, useContext, useRef } from "react";
import { ApiUrls } from "../utils/urls";
import { AppContext } from "../contexts/AppContext";
import useErrorInterceptor from "./UseErrorInterceptor";
import { InternalAppCode } from "../utils/StaticAppInfo";

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

// TODO: catch parse error

const useLogin = (): LoginHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useContext(AppContext)
    const { errorInterceptor } = useErrorInterceptor();
    const internalAppCodeRef = useRef<InternalAppCode | null>(null);

    const loginRequest = async (data: LoginData): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            const payload = JSON.stringify(data);

            const response = await fetch(ApiUrls.POST_LOGIN, {
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

            // If response is empty
            if (!response?.headers?.get('Content-Type')?.includes('application/json')) {
                throw new Error("Server response doesn't contain required data");
            }
            // response contains JSON
            else {
                const responseData = await response.json();
                // Check if the response contains the expected "token" & "userDetails" key
                if (!responseData.hasOwnProperty('userDetails') || !responseData.hasOwnProperty('token')
                    || !responseData.hasOwnProperty('refreshToken')) {
                    throw new Error('Invalid response: no data with required keys.');
                } else {
                    const userDetails = responseData.userDetails;
                    const token = responseData.token;
                    const refreshToken = responseData.refreshToken;
                    // here all necessary data parsed successfully --------------------
                    console.log("Successfully logged, tokens & userDetails assigned")
                    setSuccess(true);
                    login(token, refreshToken, userDetails)
                }
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

    return { loading, success, error, loginRequest };
};

export default useLogin;