import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext, UserDetails, UserReview } from '../contexts/AppContext';
import useMenuFetcher from './useMenuFetcher';
import useErrorInterceptor from './UseErrorInterceptor';
import { InternalAppCode } from '../utils/StaticAppInfo';

export type ReviewModel = {
    pizzaId: number,
    stars: number,
    content: string,
}

type PutReviewHookResult = {
    loading: boolean,
    success: boolean,
    error: string | null,
    updateReview: (reviewId: number, data: ReviewModel) => void,
}

type ReviewResult = {
    id: number,
    userFullName: string,
    stars: number,
    content: string,
    createdAt: string,
}


const usePutReview = (): PutReviewHookResult => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token, userDetails, setUserDetails } = useContext(AppContext);
    const { fetchMenu } = useMenuFetcher();
    const { errorInterceptor } = useErrorInterceptor();

    const internalAppCodeRef = useRef<InternalAppCode | null>(null);
    const dataIdRef = useRef<number | null>(null);
    const dataCopyRef = useRef<ReviewModel | null>(null);

    useEffect(() => {
        if (internalAppCodeRef.current === InternalAppCode.ACCESS_TOKEN_EXPIRED) {
            updateReview(dataIdRef.current as number, dataCopyRef.current as ReviewModel);
            internalAppCodeRef.current = null;
            dataCopyRef.current = null;
            dataIdRef.current = null;
        }
    }, [token])

    useEffect(() => {
        if (error) {
            showToast(error, 1);
        }
        else if (success) {
            showToast("Pomyślnie zaktualizowano opinię", 0);
        }
    }, [error, success]);

    const updateContext = (oldReviewId: number, updatedReview: ReviewResult) => {
        if (!userDetails) {
            console.error("userDetails are null, updating the context failed")
            showToast("Wydarzył się błąd podczas przetwarzania rządania, spróbuj ponownie później", 1);
            return;
        }

        // review list index for slicing
        const reviewIndex = userDetails.reviews.findIndex((review) => review.id === oldReviewId)

        const updatedUserReview: UserReview = {
            id: updatedReview.id,
            pizzaId: userDetails.reviews[reviewIndex].pizzaId,
            imageUrl: userDetails.reviews[reviewIndex].imageUrl,
            pizzaName: userDetails.reviews[reviewIndex].pizzaName,
            stars: updatedReview.stars,
            content: updatedReview.content,
            createdAt: updatedReview.createdAt,
        };

        const updatedUserDetails: UserDetails = {
            ...userDetails,
            reviews: [
                ...userDetails.reviews.slice(0, reviewIndex),
                updatedUserReview,
                ...userDetails.reviews.slice(reviewIndex + 1),
            ],
        };
        // update userDetails
        setUserDetails(updatedUserDetails);
        // refresh whole menu afterwards, so that new comment can be displayed along with potentially other new ones
        fetchMenu();
    }

    const updateReview = async (reviewId: number, data: ReviewModel): Promise<void> => {
        try {
            dataIdRef.current = reviewId;
            dataCopyRef.current = data;
            setLoading(true);
            setError(null);
            const payload = JSON.stringify(data);
            const url = `${ApiUrls.PUT_REVIEW}/${reviewId}`;
            
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
                const errorMessage = containsJson ? body.message || body : response.status;
                internalAppCodeRef.current = containsJson ? body.internalAppCode : null
                throw new Error(errorMessage);
            }

            // If response is empty
            if (!containsJson) {
                throw new Error("Request arrived with no JSON payload")
            }
            // response contains JSON
            else {
                const responseData = await response.json();
    
                // Check if the response contains the expected "result" key
                if (!responseData.hasOwnProperty('result')) {
                    throw new Error('Invalid response data: "result" key is missing.');
                } else {
                    const result = responseData.result;
                    // here all necessary data parsed successfully --------------------
                    console.log("Update successfull, data: " + result)
                    updateContext(reviewId, result)
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

    return { loading, success, error, updateReview };
}

export default usePutReview;