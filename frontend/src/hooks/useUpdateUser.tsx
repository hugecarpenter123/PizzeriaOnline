import React, { useState, useEffect, useRef, useContext } from "react";
import { RegistrationData } from "../screens/RegistrationScreen";
import { ApiUrls } from "../utils/urls";
import showToast from "../utils/showToast";
import { AppContext, UserDetails } from "../contexts/AppContext";
import useExchangeTokens from "./useExchangeTokens";
import { InternalAppCode } from "../utils/StaticAppInfo";
import useErrorInterceptor from "./useErrorInterceptor";
import FetchError from "../utils/Errors/FetchError";
import timeout from "../utils/Timeout";

type RegistrationHookResult = {
    loading: boolean;
    success: boolean;
    error: string | null;
    update: (data: UserModel) => void;
};

export type UserModel = {
    [key: string]: string,
    name: string,
    surname: string,
    email: string,
    city: string,
    cityCode: string,
    street: string,
    houseNumber: string,
    phoneNumber: string,
    dateOfBirth: string,
    oldPassword: string,
    password: string,
}

/**
 * This hook organizes post request to server with registration data along with toasting the success and failure and
 * managing the state of the loading.
 */
const useUpdateUser = (): RegistrationHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token, userDetails, setUserDetails } = useContext(AppContext);
    const { errorInterceptor } = useErrorInterceptor();

    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
        else if (success) {
            showToast("Pomyślnie zaktualizowano dane", 0);
        }
    }, [error, success]);

    // // optimized version - but backend also needs to send optimized version
    // const updateContext = (responseData: {[key:string]: string}) => {
    //     // Use the previous state (prevUserDetails) to compute the next state
    //     const updatedUserDetails = { ...userDetails } as UserDetails;

    //     Object.keys(responseData).forEach((key) => {
    //         const userModelValue = responseData[key];
    //         // Check if userModelValue is not null and not an empty string
    //         if (userModelValue !== null && userModelValue !== '') {
    //             updatedUserDetails[key] = userModelValue;
    //         }
    //     });
    //     setUserDetails(updatedUserDetails);
    // }

    // unoptimized version (backend changes given field and returns whole userDetails object)
    const updateContext = (responseData: UserDetails) => {
        setUserDetails(responseData);
    }

    const update = async (data: UserModel, newToken?: string): Promise<void> => {
        let errorMessage = null;
        let internalAppCode = null;

        try {
            setLoading(true);
            setError(null);
            const payload = JSON.stringify(data);
            const url = ApiUrls.PUT_USER_DETAILS

            const { timeoutId, controller } = timeout();
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newToken ? newToken : token}`,
                },
                signal: controller.signal,
                body: payload,
            })
            clearTimeout(timeoutId);

            if (!response.ok) {
                const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');
                const body = containsJson ? await response.json() : null;
                errorMessage = containsJson ? body.message || body : response.status;
                internalAppCode = containsJson ? body.internalAppCode : InternalAppCode.UNDEFINED_ERROR
                throw new FetchError({ errorMessage, internalAppCode });
            }

            // If response is empty throw proper error
            if (!response?.headers?.get('Content-Type')?.includes('application/json')) {
                errorMessage = "successfull request, but no JSON";
                internalAppCode = InternalAppCode.BAD_JSON_RESPONSE;
                throw new FetchError({ errorMessage, internalAppCode });
            }

            // Parse the response data
            const responseData = await response.json();
            // Check if the response contains the expected "result" key
            if (!responseData.hasOwnProperty('result')) {
                errorMessage = 'Invalid JSON response: "result" key is missing.';
                internalAppCode = InternalAppCode.BAD_JSON_RESPONSE;
                throw new FetchError({ errorMessage, internalAppCode });
            }
            const result = responseData.result;
            // here all necessary data parsed successfully --------------------
            console.log("Update successfull, data: " + result)
            updateContext(result);
            setSuccess(true);

        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`updateUser error: ${errorMessage}`);
            const callback = (newToken: string) => update(data, newToken);
            errorInterceptor(internalAppCode, setError, setLoading, callback);
        }
    };

    return { loading, success, error, update };
};

export default useUpdateUser;