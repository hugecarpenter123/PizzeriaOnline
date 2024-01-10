import React, { useState, useContext } from "react";
import { ApiUrls } from "../utils/urls";
import { AppContext } from "../contexts/AppContext";
import useForceLogout from "./useForceLogout";
import { InternalAppCode } from "../utils/StaticAppInfo";

type TokenExchangeHookResult = {
    loading: boolean;
    success: boolean;
    error: string | null;
    exchangeTokens: () => void; 
};

// TODO: catch parse error

const useExchangeTokens = (): TokenExchangeHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { refreshToken, setToken } = useContext(AppContext)
    let internalAppCode: InternalAppCode | null = null;

    const exchangeTokens = async (): Promise<void> => {
        console.log("EXCHANGE TOKENS START")
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            const payload = JSON.stringify(refreshToken);

            const response = await fetch(ApiUrls.POST_REFRESH_TOKEN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: payload,
            })

            const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');

            if (!response.ok) {
                const body = containsJson ? await response.json() : null;
                
                const errorMessage = containsJson
                    ? body.message || body
                    : response.status;

                internalAppCode = containsJson
                    ? body.internalAppCode
                    : null

                throw new Error(errorMessage);
            }

            // If response is empty
            if (!containsJson) {
                throw new Error("Server response doesn't contain required data");
            }
            // response contains JSON
            else {
                const responseData = await response.json();
                // Check if the response contains the expected "token" & "userDetails" key
                if (!responseData.hasOwnProperty('token') || !responseData.hasOwnProperty('refreshToken')) {
                    throw new Error('Invalid response: no data with required keys.');
                } else {
                    const newToken = responseData.token;
                    console.log(`new token arrived: \n${newToken}`)
                    setToken(newToken);
                    setError(null)
                    setSuccess(true);
                }
            }
        } catch (error: any) {
            console.error("catch block: " + error)

            // if refresh token is not valid somehow, force logout
            if (internalAppCode === InternalAppCode.BAD_REFRESH_TOKEN || internalAppCode === InternalAppCode.REFRESH_TOKEN_EXPIRED) {
                useForceLogout();
                setError("Sesja wygasła, proszę zaloguj się ponownie");
            } 
            // if error is of another kind - display for now
            else {
                setError(error.message)
            }
        } finally {
            setLoading(false);
            console.log("EXCHANGE TOKENS END")
        }


    };

    return { loading, success, error, exchangeTokens };
};

export default useExchangeTokens;