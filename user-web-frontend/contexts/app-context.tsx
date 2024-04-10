"use client"
import { Menu, UserDetails } from "@/lib/types";
import { getLoginDataFromSession, getTokensFromCookies, removeLoginDataFromSession, setLoginDataToSession } from "@/lib/utils";
import { ReactNode, createContext, useCallback, useEffect, useMemo, useState } from "react";

type AppContextProps = {
    token: string | null,
    setToken: (token: string | null) => void,
    refreshToken: string | null,
    userDetails: UserDetails | null,
    setUserDetails: (userData: UserDetails | null) => void,
    storageDataFetched: boolean,
    logout: () => void,
    login: (token: string, refreshToken: string, userDetails: UserDetails) => void,

    menu: Menu | undefined,
    setMenu: React.Dispatch<React.SetStateAction<Menu | undefined>>,
}

type Props = {
    children: ReactNode;
};

export const AppContext = createContext<AppContextProps>({
    token: null,
    refreshToken: null,
    userDetails: null,
    setToken: () => { },
    setUserDetails: () => { },
    storageDataFetched: false,
    logout: () => { },
    login: () => { },

    menu: undefined,
    setMenu: () => { },
});

const AppContextProvider = ({ children }: Props) => {
    console.log("AppContextProvider render");
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [storageDataFetched, setStorageDataFetched] = useState<boolean>(false);

    const [menu, setMenu] = useState<undefined | Menu>(undefined);

    useEffect(() => {
        const { token: storedToken, refreshToken: storedRefreshToken, userDetails: storedUserDetails } = getLoginDataFromSession();
        console.log(`\t-storedToken: ${token}\n\t-storedRefreshToken: ${refreshToken}\n\t-userDetails: ${userDetails != null}`)

        if (storedToken) {
            setToken(storedToken);
        }
        if (storedRefreshToken) {
            setRefreshToken(storedRefreshToken);
        }
        if (storedUserDetails) {
            setUserDetails(storedUserDetails);
        }
        setStorageDataFetched(true);
    }, []);

    // Save data to SecureStore whenever token or userData changes
    useEffect(() => {
        if (token && refreshToken && userDetails) {
            setLoginDataToSession(token, refreshToken, userDetails)
        }
    }, [token, refreshToken, userDetails]);

    const logout = useCallback(
        () => {
            removeLoginDataFromSession();
            setToken(null);
            setRefreshToken(null);
            setUserDetails(null);
        },
        []
    )

    const login = useCallback(
        (token: string, refreshToken: string, userDetails: UserDetails) => {
            setToken(token);
            setRefreshToken(refreshToken);
            setUserDetails(userDetails);
        },
        []
    );

    const contextValue = useMemo(() => (
        {
            token,
            setToken,
            refreshToken,
            userDetails,
            setUserDetails,
            storageDataFetched,
            logout,
            login,
            menu,
            setMenu
        }
    ), [token, refreshToken, userDetails, menu])

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;