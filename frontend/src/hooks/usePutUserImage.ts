import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext, UserDetails, UserReview } from '../contexts/AppContext';
import useMenuFetcher from './useMenuFetcher';
import useUpdateUser from './useUpdateUser';
import useFetchUserDetails from './useFetchUserDetails';
import { OrderPayloadModel } from '../screens/Cart/OrderCompletionScreen';
import { MainScreenContext } from '../contexts/MainScreenContext';
import useExchangeTokens from './useExchangeTokens';
import { InternalAppCode } from '../utils/StaticAppInfo';

type PutUserImageRHookResult = {
    loading: boolean,
    success: boolean,
    error: string | null,
    putImage: (imageUri: String) => void,
}

const usePutUserImage = (): PutUserImageRHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useContext(AppContext);
    const { fetchUserDetails: updateUserDetails } = useFetchUserDetails();
    const { exchangeTokens } = useExchangeTokens();

    const internalAppCodeRef = useRef<InternalAppCode | null>(null);
    const dataCopyRef = useRef<String | null>(null);

    // handle error and success
    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
        else if (success) {
            updateContext();
            showToast("Pomyślnie dodano zdjęcie", 0);
        }
    }, [error, success]);

    // retry mechanism
    useEffect(() => {
        if (internalAppCodeRef.current && dataCopyRef.current) {
            // console.log(`now retry function should happen with this token: \n${token}\ncode: ${internalAppCodeRef.current}\ndataCopy: ${JSON.stringify(dataCopyRef.current)}`);
            putImage(dataCopyRef.current)
            dataCopyRef.current = null;
            internalAppCodeRef.current = null;
        } else {
            console.log("Token changed but no retry");
        }
    }, [token])

    const updateContext = () => {
        updateUserDetails();
    }

    const prepareFormData = (imageUri: String) => {
        const mimeTypes: { [key: string]: string } = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
        };

        const formData = new FormData();
        const fileExtension = imageUri.split('.').pop() || "jpg";
        const mimeType = mimeTypes[fileExtension.toLowerCase()]

        formData.append('image', {
            uri: imageUri,
            type: mimeType,
            name: `user_image.${fileExtension}`,
        });

        return formData;
    }

    const putImage = async (imageUri: String): Promise<void> => {
        try {
            dataCopyRef.current = imageUri;
            setLoading(true);
            setError(null);

            const url = `${ApiUrls.PUT_USER_IMAGE}`;
            const headers: { [key: string]: string } = {
                'Content-Type': 'multipart/form-data',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const formData = prepareFormData(imageUri);

            const response = await fetch(url, {
                method: 'PUT',
                headers: headers,
                body: formData,
            });

            console.log("response: ")
            console.log(response);
            if (!response.ok) {
                // Handle error response with status code 4xx
                const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');
                const body = containsJson ? await response.json() : null;

                const errorMessage = containsJson
                    ? body.message || body
                    : response.status;

                const internalCode = containsJson
                    ? body.internalAppCode
                    : null

                internalAppCodeRef.current = internalCode;
                throw new Error(errorMessage);
            }

            // here reponse is ok
            console.log("Image set successfully!");
            setSuccess(true);
        } catch (error: any) {
            console.error(error.message)
            if (internalAppCodeRef.current === InternalAppCode.ACCESS_TOKEN_EXPIRED) {
                exchangeTokens();
            }

        } finally {
            // if token needs to be refreshed then loading indicator should keep on spinning
            if (internalAppCodeRef.current !== InternalAppCode.ACCESS_TOKEN_EXPIRED) {
                setLoading(false);
            }
        }

    };

    return { loading, success, error, putImage };
}

export default usePutUserImage;