import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext, UserDetails, UserReview } from '../contexts/AppContext';
import useMenuFetcher from './useMenuFetcher';
import useUpdateUser from './useUpdateUser';
import useFetchUserDetails from './useFetchUserDetails';
import { InternalAppCode } from '../utils/StaticAppInfo';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import useErrorInterceptor from './UseErrorInterceptor';

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
    const { fetchMenu } = useMenuFetcher();
    const { fetchUserDetails: updateUserDetails } = useFetchUserDetails();
    const { errorInterceptor } = useErrorInterceptor();

    const internalAppCodeRef = useRef<InternalAppCode | null>(null);
    const dataCopyRef = useRef<ReviewModel | null>(null);

    useEffect(() => {
        if (internalAppCodeRef.current && dataCopyRef.current) {
            addReview(dataCopyRef.current)
            dataCopyRef.current = null;
            internalAppCodeRef.current = null;
        } else {
            console.log("Token changed but no retry");
        }
    }, [token])

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

    const addReview = async (data: ReviewModel): Promise<void> => {
        try {
            dataCopyRef.current = data;
            setLoading(true);
            setError(null);
            const url = `${ApiUrls.POST_REVIEW}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                // Handle error response with status code 4xx
                const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');
                const body = containsJson ? await response.json() : null;
                const errorMessage = containsJson ? (body.message || body) : response.status;
                internalAppCodeRef.current = containsJson ? body.internalAppCode : null

                throw new Error(errorMessage);
            }

            // here reponse is ok
            console.log("Review added successfully!");
            setSuccess(true);

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

    return { loading, success, error, addReview };
}

export default useCreateReview;