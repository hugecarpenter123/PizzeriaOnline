import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext, UserDetails, UserReview } from '../contexts/AppContext';
import useUpdateUser from './useUpdateUser';
import useFetchUserDetails from './useFetchUserDetails';
import { InternalAppCode } from '../utils/StaticAppInfo';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import useErrorInterceptor from './useErrorInterceptor';
import { MainScreenContext } from '../contexts/MainScreenContext';
import useFetchMenu from './useFetchMenu';
import Timeout from '../utils/Timeout';
import FetchError from '../utils/Errors/FetchError';

export type ReviewModel = {
    pizzaId: number,
    stars: number,
    content: string,
}

type PutReviewHookResult = {
    loading: boolean,
    success: boolean,
    error: string | null,
    addReview: (data: ReviewModel) => void,
}

type ReviewResult = {
    id: number,
    userFullName: string,
    stars: number,
    content: string,
    createdAt: string,
}


const useCreateReview = (): PutReviewHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useContext(AppContext);
    const { fetchMenu } = useFetchMenu();
    const { fetchUserDetails: updateUserDetails } = useFetchUserDetails();
    const { errorInterceptor } = useErrorInterceptor();

    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
        else if (success) {
            updateContext();
            showToast("Pomyślnie dodano opinię", 0);
        }
    }, [error, success]);

    const updateContext = () => {
        // refresh whole menu afterwards
        fetchMenu();
        // update userDetails
        updateUserDetails();
    }

    const addReview = async (data: ReviewModel, newToken?: string): Promise<void> => {
        let errorMessage = null;
        let internalAppCode = null;
        setLoading(true);
        setError(null);

        try {
            const { timeoutId, controller } = Timeout();
            const url = `${ApiUrls.POST_REVIEW}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newToken ? newToken : token}`,
                },
                body: JSON.stringify(data),
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
            console.log("Review added successfully!");
            setSuccess(true);

        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`createReview error: ${errorMessage}`);

            const callback = () => addReview(data, newToken);
            errorInterceptor(internalAppCode, setError, setLoading, callback);
        }

    };

    return { loading, success, error, addReview };
}

export default useCreateReview;