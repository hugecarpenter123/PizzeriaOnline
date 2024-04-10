import React, { useContext } from "react";
import { Order } from "../utils/AppTypes";
import { AppContext } from "../contexts/AppContext";
import { ApiUrls } from "../utils/urls";
import EventSource from "react-native-sse";

type OrderSubscriptionResult = {
    subscribe: (callback: (order: Order) => void) => () => void,
}

type Events = "orderEvent";

const useOrderSubscription = (): OrderSubscriptionResult => {
    const { token } = useContext(AppContext);
    const url = ApiUrls.GET_ORDER_EVENT_SUBSCRIPTION;

    const subscribe = (callback: (order: Order) => void) => {
        const es = new EventSource<Events>(
            url,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                timeoutBeforeConnection: 1000,
                pollingInterval: 0, // Remember to set pollingInterval to 0 to disable reconnections
                debug: true,
            },
        );

        es.addEventListener("open", () => {
            console.log("subscription opened()")
        });

        es.addEventListener("orderEvent", (event) => {
            console.log(`event listener message: \n\t-event: ${event}\n\t-event.type: ${event.type}}\n\t-event.data: ${JSON.stringify(event.data)}\n\t-event.url: ${event.url}`)
        });

        es.addEventListener("error", (error: any) => {
            console.log(`subscription error: \n\t-error.type.${error.type}`)
            console.log("error.message: " + error.message)
        })

        es.addEventListener("close", () => {
            console.log("subscription closed");
        })

        const clearSubscription = () => {
            es.removeAllEventListeners();
            es.close();
        }

        return clearSubscription
    }

    return { subscribe };
}

export default useOrderSubscription;    