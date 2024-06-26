import { useContext, useEffect, useState } from "react";
import useErrorInterceptor from "./useErrorInterceptor";
import FetchError from "@/lib/FetchError";
import { InternalAppCode } from "@/lib/static-app-info";
import Timeout from "@/lib/timeout";
import { ApiUrls } from "@/lib/urls";
import { Menu } from "@/lib/types";
import { AppContext } from "@/contexts/app-context";
import { boolean } from "zod";


type FetchMenuHookResult = {
    error: null | string,
    loading: boolean,
    // menu: Menu | undefined,
    fetchMenu: () => Promise<void>,
}

type FetchMenuHookProps = boolean


const useFetchMenu = (callOnMount: FetchMenuHookProps): FetchMenuHookResult => {
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { setMenu } = useContext(AppContext);
    const { errorInterceptor } = useErrorInterceptor();

    useEffect(() => {
        if (callOnMount) {
            fetchMenu();
        }
    }, [])

    const fetchMenu = async () => {
        console.log("fetch menu called");
        let errorMessage = null;
        let internalAppCode = null;
        setLoading(true);
        setError(null);

        try {
            const { timeoutId, controller } = Timeout();
            const response = await fetch(ApiUrls.GET_MENU, {
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

            // all necessary data parsed successfully
            const result = responseData.result;
            console.log("menu fetched successfully")
            setMenu(result);
            setLoading(false);


        } catch (error: any) {
            const internalAppCode = error instanceof FetchError
                ? error.internalAppCode
                : error.name === "AbortError" ? InternalAppCode.REQUEST_TIMED_OUT : InternalAppCode.UNDEFINED_ERROR;

            const errorMessage = error instanceof FetchError
                ? error.message
                : error.name === "AbortError" ? "Request został anulowany przez timeout" : `Niezdefiniowany błąd: ${error}`;

            console.error(`InernalAppCode: ${internalAppCode}`);
            console.error(`fetchMenu error: ${errorMessage}`);
            errorInterceptor(internalAppCode, setError, setLoading);
        }
    };

    return {
        loading,
        error,
        fetchMenu,
    };
};

export default useFetchMenu;
