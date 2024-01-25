import React, { useState, useEffect, useContext, useRef } from 'react'
import showToast from '../utils/showToast';
import { ApiUrls } from '../utils/urls';
import { AppContext, UserDetails, UserReview } from '../contexts/AppContext';
import useErrorInterceptor from './useErrorInterceptor';
import { InternalAppCode } from '../utils/StaticAppInfo';
import { MainScreenContext } from '../contexts/MainScreenContext';
import useFetchMenu from './useFetchMenu';
import FetchError from '../utils/Errors/FetchError';
import Timeout from '../utils/Timeout';

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

    // ta linijka być może jest problemem ponieważ wcześniej było bezpośredniu `useFetchMenu()` !!!!!
    // błąd wynikał z jakiegoś braku REFRESH TOKENU - unhandled promise czy coś
    const { fetchMenu } = useFetchMenu();

    const { errorInterceptor } = useErrorInterceptor();
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

    const updateReview = async (reviewId: number, data: ReviewModel, newToken?: string): Promise<void> => {
        let internalAppCode = null;
        let errorMessage = null;

        try {
            setLoading(true);
            setError(null);

            const { timeoutId, controller } = Timeout();
            const payload = JSON.stringify(data);
            const url = `${ApiUrls.PUT_REVIEW}/${reviewId}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${newToken ? newToken : token}`,
                },
                body: payload,
                signal: controller.signal,
            })

            clearTimeout(timeoutId);

            if (!response.ok) {
                const containsJson = response?.headers?.get('Content-Type')?.includes('application/json');
                const body = containsJson ? await response.json() : null;
                errorMessage = containsJson ? body.message || body : response.status;
                internalAppCode = containsJson ? body.internalAppCode : InternalAppCode.UNDEFINED_ERROR
                throw new FetchError({ errorMessage, internalAppCode });
            }


            // If response is empty throw
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


        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`putReview error: ${errorMessage}`);
            const callback = (newToken: string) => updateReview(reviewId, data, newToken);
            errorInterceptor(internalAppCode, setError, setLoading, callback);
        }
    };

    return { loading, success, error, updateReview };
}

export default usePutReview;