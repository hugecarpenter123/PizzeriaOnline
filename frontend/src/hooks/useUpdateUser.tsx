import React, { useState, useEffect, useRef, useContext } from "react";
import { RegistrationData } from "../screens/RegistrationScreen";
import { ApiUrls } from "../utils/urls";
import showToast from "../utils/showToast";
import { AppContext, UserDetails } from "../contexts/AppContext";
import useExchangeTokens from "./useExchangeTokens";
import { InternalAppCode } from "../utils/StaticAppInfo";
import useErrorInterceptor from "./UseErrorInterceptor";

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

    const internalAppCodeRef = useRef<InternalAppCode | null>(null);
    const dataCopyRef = useRef<UserModel | null>(null);

    useEffect(() => {
        if (internalAppCodeRef.current === InternalAppCode.ACCESS_TOKEN_EXPIRED) {
            update(dataCopyRef.current as UserModel);
            internalAppCodeRef.current = null;
            dataCopyRef.current = null;
        }
    }, [token])

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

    const update = async (data: UserModel): Promise<void> => {
        try {
            dataCopyRef.current = data;
            setLoading(true);
            setError(null);
            const payload = JSON.stringify(data);
            const url = ApiUrls.PUT_USER_DETAILS

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: payload,
            })

            const containsJson = response?.headers?.get('Content-Type')?.includes('application/json')

            if (!response.ok) {
                // Handle error response with status code 4xx
                const body = containsJson ? await response.json() : null;
                const errorMessage = containsJson ? (body.message || body) : response.status;
                internalAppCodeRef.current = containsJson ? body.internalAppCode : null
                throw new Error(errorMessage);
            }

            // If response is empty
            if (!containsJson) {
                // throw new Error("Request arrived with no JSON payload")
                console.log("Request arrived with no JSON payload");
                
            }
            // response contains JSON
            else {
                const responseData = await response.json();

                // Check if the response contains the expected "result" key
                if (!responseData.hasOwnProperty('result')) {
                    throw new Error('Invalid response data: "result" key is missing.');
                    console.log("Response data is missing");
                } else {
                    const result = responseData.result;
                    // here all necessary data parsed successfully --------------------
                    console.log("Update successfull, data: " + result)
                    updateContext(result);
                    setSuccess(true);
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
            if (internalAppCodeRef.current !== InternalAppCode.ACCESS_TOKEN_EXPIRED) setLoading(false);
        }
    };

    return { loading, success, error, update };
};

export default useUpdateUser;