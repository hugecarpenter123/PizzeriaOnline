import { useState, useEffect, useContext } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext } from '../contexts/AppContext';
import useFetchUserDetails from './useFetchUserDetails';
import { InternalAppCode } from '../utils/StaticAppInfo';
import timeout from '../utils/Timeout';
import FetchError from '../utils/Errors/FetchError';
import useErrorInterceptor from './useErrorInterceptor';

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
    const { errorInterceptor } = useErrorInterceptor();


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

    const putImage = async (imageUri: String, newToken?: string): Promise<void> => {
        let errorMessage = null;
        let internalAppCode = null;
        try {
            setLoading(true);
            setError(null);

            const url = `${ApiUrls.PUT_USER_IMAGE}`;
            const formData = prepareFormData(imageUri);
            const { timeoutId, controller } = timeout();
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${newToken ? newToken : token}`,
                },
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');
                const body = containsJson ? await response.json() : null;
                errorMessage = containsJson ? body.message || body : response.status;
                internalAppCode = containsJson ? body.internalAppCode : InternalAppCode.UNDEFINED_ERROR
                throw new FetchError({ errorMessage, internalAppCode });
            }

            // here reponse is ok
            console.log("Image set successfully!");
            setLoading(false);
            setSuccess(true);
        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`putUserImage error: ${errorMessage}`);
            const callback = (newToken: string) => putImage(imageUri, newToken);
            errorInterceptor(internalAppCode, setError, setLoading, callback);
        };
    }

    return { loading, success, error, putImage };
}

export default usePutUserImage;