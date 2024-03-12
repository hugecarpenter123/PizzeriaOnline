import React, { memo } from "react";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../AppStacks";
import OrderCompletionScreen from "./OrderCompletionScreen";
import CartScreen from "./CartScreen";

export type CartParamList = {
    Cart: undefined,
    OrderCompletion: { sum: number },
}

const CartStacks = createNativeStackNavigator<CartParamList>();

const CartStack = () => {
    console.log("CartStack render")
    return (
        <CartStacks.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <CartStacks.Screen name="Cart" component={CartScreen} />
            <CartStacks.Screen name="OrderCompletion" component={OrderCompletionScreen} />
        </CartStacks.Navigator>
    )
}

// export default memo(CartStack);
export default CartStack;