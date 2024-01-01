import React, { ReactNode, useState, createContext, useEffect, useCallback } from "react"
import { useInternetConnectivity } from "../hooks/useInternetConnectivity";
import * as SecureStore from "expo-secure-store";
import { orderedDrink, orderedPizza } from "./MainScreenContext";

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

export type UserOrder = {
  order_id: string,
  orderedPizzas: orderedPizza[],
  orderedDrinks: orderedDrink[],
  ordererName: string,
  deliveryAddress: string,
  orderStatus: OrderStatus,
  orderType: string,
  phone: string,
  createdAt: string,
}

enum OrderType {
  DELIVERY,
  PICKUP,
}

enum OrderStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
  CANCELLED
}

export type UserReview = {
  id: number,
  pizzaId: number,
  imageUrl: string,
  pizzaName: string,
  stars: number,
  content: string,
  createdAt: string, // LocalDateTime
}

export type UserDetails = {
  [key: string]: any;
  id: number,
  imageUrl: string | undefined,
  name: string,
  surname: string,
  email: string,
  city: string,
  cityCode: string,
  street: string,
  houseNumber: string,
  phoneNumber: string,
  dateOfBirth: string,
  reviews: UserReview[], // TODO: possibly remove it, and access it though endpoint on a given screen
}

type LoginResponse = {
  token: string,
  userDetails: UserDetails,
}


type Props = {
  children: ReactNode;
};

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

const AppContextProvider = ({ children }: Props) => {
  console.log("AppContextProvider render");

  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  // if for some reason fetching lasted too long, it will prevent App from picking wrong initial Screen 
  const [storageDataFetched, setStorageDataFetched] = useState<boolean>(false);
  const { isConnected } = useInternetConnectivity();

  // Load data from SecureStore on app startup
  useEffect(() => {
    const loadDataFromStorage = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("token");
        const storedRefreshToken = await SecureStore.getItemAsync("refreshToken");
        const storedUserData = await SecureStore.getItemAsync("userData");
        if (storedToken) {
          setToken(storedToken);
        }
        if (storedRefreshToken) {
          setRefreshToken(storedRefreshToken);
        }
        if (storedUserData) {
          setUserDetails(JSON.parse(storedUserData));
        }
        setStorageDataFetched(true);
      } catch (error) {
        console.error("Error loading data from storage:", error);
      }
    };

    loadDataFromStorage();
  }, []);

  // Save data to SecureStore whenever token or userData changes
  useEffect(() => {
    const saveDataToStorage = async () => {
      try {
        if (token) {
          await SecureStore.setItemAsync("token", token);
        } else {
          await SecureStore.deleteItemAsync("token");
        }
        if (refreshToken) {
          await SecureStore.setItemAsync("refreshToken", refreshToken);
        } else {
          await SecureStore.deleteItemAsync("refreshToken");
        }
        if (userDetails) {
          await SecureStore.setItemAsync("userData", JSON.stringify(userDetails));
        } else {
          await SecureStore.deleteItemAsync("userData");
        }
      } catch (error) {
        console.error("Error saving data to storage:", error);
      }
    };

    saveDataToStorage();
  }, [token, refreshToken, userDetails]);

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

  // const removeCartStorage = async () => {
  //   await SecureStore.deleteItemAsync("cart");
  // }

  return (
    <AppContext.Provider value={{ isConnected, token, setToken, refreshToken, userDetails, setUserDetails, storageDataFetched, logout, login }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider;