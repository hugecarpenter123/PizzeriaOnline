import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import FetchError from '../utils/Errors/FetchError';
import { InternalAppCode } from '../utils/StaticAppInfo';
import showToast from '../utils/showToast';
import useErrorInterceptor from './useErrorInterceptor';
import { Order } from '../utils/AppTypes';
import { ApiUrls } from '../utils/urls';
import Timeout from '../utils/Timeout';
import RNEventSource from 'react-native-event-source';

type OrderListenerResult = {
    subscribe: (clb: (order: Order) => void) => void,
}

type CallbackArg = (order: Order) => void

// todo: trzeba zakutalizwać stan w kontekście aplikacji
const useOrdersListener2 = (): OrderListenerResult => {
    const { token } = useContext(AppContext);

    const subscribe = async (callbackArg: CallbackArg): Promise<void> => {
        const url = ApiUrls.GET_ORDER_EVENT_SUBSCRIPTION;
        const eventSource = new RNEventSource(url, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })

        eventSource.addEventListener('message', (data) => {
            console.log("data.type): " + JSON.stringify(data.type));
            console.log("data.data): " + JSON.stringify(data.data));
            console.log("data.lastEventId: " + JSON.stringify(data.lastEventId))
            console.log("data.origin: " + JSON.stringify(data.origin))
        });

        eventSource.addEventListener('open', (data) => {
            console.log("data.type): " + JSON.stringify(data.type));
            console.log("data.data): " + JSON.stringify(data.data));
            console.log("data.lastEventId: " + JSON.stringify(data.lastEventId))
            console.log("data.origin: " + JSON.stringify(data.origin))
        });

        eventSource.addEventListener('close', (data) => {
            console.log("data.type): " + JSON.stringify(data.type));
            console.log("data.data): " + JSON.stringify(data.data));
            console.log("data.lastEventId: " + JSON.stringify(data.lastEventId))
            console.log("data.origin: " + JSON.stringify(data.origin))
        });

        
        eventSource.addEventListener('onopen', (data) => {
            console.log("data.type): " + JSON.stringify(data.type));
            console.log("data.data): " + JSON.stringify(data.data));
            console.log("data.lastEventId: " + JSON.stringify(data.lastEventId))
            console.log("data.origin: " + JSON.stringify(data.origin))
        });

        eventSource.addEventListener('onclose', (data) => {
            console.log("data.type): " + JSON.stringify(data.type));
            console.log("data.data): " + JSON.stringify(data.data));
            console.log("data.lastEventId: " + JSON.stringify(data.lastEventId))
            console.log("data.origin: " + JSON.stringify(data.origin))
        });

        eventSource.addEventListener('orderEvent', (data) => {
            console.log("data.type): " + JSON.stringify(data.type));
            console.log("data.data): " + JSON.stringify(data.data));
            console.log("data.lastEventId: " + JSON.stringify(data.lastEventId))
            console.log("data.origin: " + JSON.stringify(data.origin))
        });

        eventSource.addEventListener("error", (event) => {
            console.log("data.type): " + JSON.stringify(event.type));
            console.log("data.data): " + JSON.stringify(event.data));
            console.log("data.lastEventId: " + JSON.stringify(event.lastEventId))
            console.log("data.origin: " + JSON.stringify(event.origin))
        })

    };

    return { subscribe };
}

export default useOrdersListener2;