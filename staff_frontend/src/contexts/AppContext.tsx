import React, { ReactNode, useState, createContext, useEffect, useCallback } from "react"
import { useInternetConnectivity } from "../hooks/useInternetConnectivity";
import { UserDetails } from "../utils/AppTypes";

type AppContextProps = {
  isConnected: boolean,
  token: string | null,
  setToken: (token: string | null) => void,
  refreshToken: string | null,
  userDetails: UserDetails | null,
  setUserDetails: (userData: UserDetails | null) => void,
  storageDataFetched: boolean,
  logout: () => void,
  login: (token: string, refreshToken: string, userDetails: UserDetails) => void,
}


export const AppContext = createContext<AppContextProps>({
  isConnected: true,
  token: null,
  refreshToken: null,
  userDetails: null,
  setToken: () => { },
  setUserDetails: () => { },
  storageDataFetched: false,
  logout: () => { },
  login: () => { }
});

type Props = {
  children: ReactNode;
};

const AppContextProvider = ({ children }: Props) => {
  console.log("AppContextProvider render");

  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [storageDataFetched, setStorageDataFetched] = useState<boolean>(false);
  const { isConnected } = useInternetConnectivity();

  useEffect(() => {
    // retrieve potential necessary data from storage on application boot
    setStorageDataFetched(true);
    // set landscape mode


  }, [])

  const logout = useCallback(
    () => {
      setToken(null);
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

  return (
    <AppContext.Provider value={{ isConnected, token, setToken, refreshToken, userDetails, setUserDetails, storageDataFetched, logout, login }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;