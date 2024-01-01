import { useState } from "react";
import { ApiUrls } from "../utils/urls";
import { Menu } from "../contexts/MainScreenContext";


type FetchMenuHookResult = {
    error: null | string,
    loading: boolean,
    menu: Menu | undefined,
    fetchMenu: () => Promise<void>,
}

const useFetchMenu = (): FetchMenuHookResult => {
    const [error, setError] = useState<null | string>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [menu, setMenu] = useState<undefined | Menu>(undefined);

    const fetchMenu = async () => {
        console.log("fetch menu called");
        setLoading(true);
        setError(null);

        try {
            // promise that will ensure that after 6 seconds fetch will stop waiting
            const timeoutPromise = new Promise((resolve, reject) => {
                setTimeout(() => reject("Zbut długie oczekiwanie na odpowiedź serwera"), 6000);
            });

            // promise that fetches data and sets it to MainScreenContext on success
            const fetchPromise = fetch(ApiUrls.GET_MENU)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Server responded with an unwanted response code");
                    }
                    return response.json();
                })
                .then((data) => {
                    const menuData: Menu = {
                        pizzaList: data.pizzaList,
                        drinkList: data.drinkList,
                    };
                    setError(null);
                    setMenu(menuData);
                    setLoading(false);
                });

            // whichever promise resolves quicker, the other will be terminated
            Promise.race([fetchPromise, timeoutPromise])
                .catch(e => setError(e))
                .finally(() => setLoading(false));

        } catch (error: any) {
            console.log("FetchMenu catch block: ", error);
            setError("Wydarzył się niezdefiniowany błąd podczas pobierania menu.");
        }
    };

    return {
        loading,
        error,
        menu,
        fetchMenu,
    };
};

export default useFetchMenu;
