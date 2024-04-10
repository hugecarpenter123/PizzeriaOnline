import React, { useState, createContext, useEffect, ReactNode, useCallback, useMemo } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum OrderItemType {
    PIZZA,
    DRINK
}

export enum OrderRemoveType {
    SINGLE,
    ALL
}

export enum DrinkSizes {
    SMALL_330,
    MEDIUM_500,
    BIG_1000
}

export enum PizzaSizes {
    SMALL,
    MEDIUM,
    BIG
}

// todo: type declaration for order
export interface Order {
    orderedPizzaList: orderedPizza[];
    orderedDrinkList: orderedDrink[];
}

export type orderedDrink = {
    drinkId: number,
    size: DrinkSizes,
    quantity: number
}

export type orderedPizza = {
    pizzaId: number,
    size: PizzaSizes,
    quantity: number
}

export interface Menu {
    // todo: create this interface
    pizzaList: Pizza[];
    drinkList: Drink[];
}

export type Review = {
    id: number,
    userFullName: string,
    userImageUrl: string,
    stars: number,
    content: string,
    createdAt: string,
};

export type Pizza = {
    id: number,
    name: string,
    smallSizePrice: number,
    mediumSizePrice: number,
    bigSizePrice: number,
    ingredients: string[],
    reviews: Review[],
    imageUrl: string,
};

export type Drink = {
    id: number;
    name: string;
    smallSizePrice: number;
    mediumSizePrice: number;
    bigSizePrice: number;
    imageUrl: string,
};

// USER ORDER ==========================================================
type UserOrderPizza = {
    imageUrl: string,
    name: string,
    size: string,
    quantity: number,
}

type UserOrderDrink = {
    imageUrl: string,
    name: string,
    size: string,
    quantity: number,
}

export type OrderType = "DELIVERY" | "PICKUP";

export type OrderStatus = "PENDING" | "IN_PROGESS" | "COMPLETED" | "CANCELLED";

export type UserOrder = {
    orderId: number,
    orderedPizzas: UserOrderPizza[],
    orderedDrinks: UserOrderDrink[],
    ordererName: string,
    deliveryAddress: string,
    orderStatus: OrderStatus,
    orderType: OrderType,
    phone: string,
    createdAt: string,
    total: number,
}


// USER ORDER ==========================================================

export type Props = {
    children: ReactNode;
};

export const MainScreenContext = createContext<MainScreenContextProps>({} as MainScreenContextProps);

export type MainScreenContextProps = {
    cart: Order,
    clearCart: () => void
    menu: Menu | undefined,
    setMenu: React.Dispatch<React.SetStateAction<Menu | undefined>>
    addOrderItem: (id: number, size: number, type: OrderItemType) => void,
    removeOrderItem: (id: number, type: OrderItemType, size: number, removeType: OrderRemoveType) => void,
    cartItemsCount: number,
    userOrders: UserOrder[] | undefined,
    setUserOrders: React.Dispatch<React.SetStateAction<UserOrder[] | undefined>>
};

const MainScreenContextProvider = ({ children }: Props) => {

    console.log("MainScreenContextProvider render")

    const [cart, setCart] = useState<Order>({ orderedPizzaList: [] as orderedPizza[], orderedDrinkList: [] as orderedDrink[] })
    const [cartFetched, setCartFetched] = useState<boolean>(false);
    const [menu, setMenu] = useState<undefined | Menu>(undefined);
    const [userOrders, setUserOrders] = useState<undefined | UserOrder[]>(undefined);
    const [cartItemsCount, setCartItemsCount] = useState(0);

    useEffect(() => {
        // can be more optimized, but for now it recalculates all
        setCartItemsCount(calcCartItems)
        // save cart to storage the cart contenet, but perform it only after making sure that
        // initial async fetch from storage was completed, otherwise empty it would overwrite current storage with empty {}
        if (cartFetched) {
            saveDataToStorage();
        }
    }, [cart])

    // MAIN USE EFFECT
    useEffect(() => {
        loadDataFromStorage();
    }, []);


    const loadDataFromStorage = async () => {
        console.log("Fetch \"cart\" from AsyncStorage");
        try {
            const storedCartContent = await AsyncStorage.getItem("cart");
            if (storedCartContent) {
                setCart(JSON.parse(storedCartContent));
            }
            setCartFetched(true);
        } catch (error) {
            console.error("Error loading cart data from storage:", error);
        }
    };

    const saveDataToStorage = async () => {
        console.log("Update AsyncStorage with \"cart\"");

        try {
            await AsyncStorage.setItem("cart", JSON.stringify(cart));
        } catch (error) {
            console.error("Error saving cart data to storage:", error);
        }
    };

    const calcCartItems = (): number => {
        console.log("MainContextProvider calcCartItems() ---------------")
        let count = 0;
        cart.orderedPizzaList.forEach((orderedPizza) => {
            count += orderedPizza.quantity
        })
        cart.orderedDrinkList.forEach((orderedDrink) => {

            count += orderedDrink.quantity;
        })
        return count;
    }

    const addPizzaOrder = (pizzaId: number, size: number) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            let pizzaQuantityUpdated = false;

            updatedCart.orderedPizzaList.map((orderedPizza) => {
                if (orderedPizza.pizzaId === pizzaId && orderedPizza.size === size) {
                    orderedPizza.quantity++;
                    pizzaQuantityUpdated = true;
                    return;
                }
            });

            if (!pizzaQuantityUpdated) {
                updatedCart.orderedPizzaList.push({ pizzaId, size, quantity: 1 });
            }

            return updatedCart; // Return the updated cart state
        });
    };

    const addDrinkOrder = (drinkId: number, size: number) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            let drinkQuantityUpdated = false;

            updatedCart.orderedDrinkList.map((orderedDrink) => {
                if (orderedDrink.drinkId === drinkId && orderedDrink.size === size) {
                    orderedDrink.quantity++;
                    drinkQuantityUpdated = true;
                    return;
                }
            });

            if (!drinkQuantityUpdated) {
                updatedCart.orderedDrinkList.push({ drinkId, size, quantity: 1 });
            }

            return updatedCart;
        })
    }

    const addOrderItem = useCallback(
        (id: number, size: number, type: OrderItemType) => {
            if (type === OrderItemType.PIZZA) {
                console.log("type is Pizza: should add pizza to cart")
                addPizzaOrder(id, size)
            } else {
                console.log("type is Drink: should add drink to cart")
                addDrinkOrder(id, size)
            }
        },
        []
    )

    const removeOrderItem = useCallback(
        (id: number, type: OrderItemType, size: number, removeType: OrderRemoveType) => {
            setCart((prevCart) => {
                const updatedCart = { ...prevCart }
                // if order type is pizza
                if (type == OrderItemType.PIZZA) {
                    // grab reference of the index of the array
                    const indexToUpdate = updatedCart.orderedPizzaList.findIndex((x) => x.pizzaId == id && x.size == size);

                    // remove only single item
                    if (removeType === OrderRemoveType.SINGLE) {
                        // grab reference to the item
                        const itemToUpdate = updatedCart.orderedPizzaList[indexToUpdate];

                        // quantity > 1 ? decrease : remove whole item
                        if (itemToUpdate.quantity > 1) {
                            updatedCart.orderedPizzaList[indexToUpdate].quantity--;
                        } else {
                            updatedCart.orderedPizzaList.splice(indexToUpdate, 1);
                        }
                    } else if (removeType === OrderRemoveType.ALL) {
                        updatedCart.orderedPizzaList.splice(indexToUpdate, 1);
                    }
                }
                // order type is Drink
                else {
                    // grab reference of the index of the array
                    const indexToUpdate = updatedCart.orderedDrinkList.findIndex((x) => x.drinkId == id && x.size == size);

                    // remove only single item
                    if (removeType === OrderRemoveType.SINGLE) {
                        // grab reference to the item
                        const itemToUpdate = updatedCart.orderedDrinkList[indexToUpdate];

                        // quantity > 1 ? decrease : remove whole item
                        if (itemToUpdate.quantity > 1) {
                            updatedCart.orderedDrinkList[indexToUpdate].quantity--;
                        } else {
                            updatedCart.orderedDrinkList.splice(indexToUpdate, 1);
                        }
                    } else if (removeType === OrderRemoveType.ALL) {
                        updatedCart.orderedDrinkList.splice(indexToUpdate, 1);
                    }
                }
                return updatedCart;
            })
        },
        []
    )

    const clearCart = useCallback(
        () => {
            setCart({ orderedPizzaList: [] as orderedPizza[], orderedDrinkList: [] as orderedDrink[] })
        },
        []
    )

    const contextValue = useMemo(() => ({
        cart,
        clearCart,
        cartItemsCount,
        menu,
        setMenu,
        addOrderItem,
        removeOrderItem,
        userOrders,
        setUserOrders,
    }), [cart, cartItemsCount, menu, userOrders]);


    return (
        <MainScreenContext.Provider value={contextValue}>
            {children}
        </MainScreenContext.Provider>
    )
}

export default MainScreenContextProvider;