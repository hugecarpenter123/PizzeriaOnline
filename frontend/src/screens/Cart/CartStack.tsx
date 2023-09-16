import React from "react";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../AppStacks";
import { TabParamList } from "../MainScreen";
import OrderCompletionScreen from "./OrderCompletionScreen";
import CartScreen from "./CartScreen";

export type CartParamList = {
    Cart: undefined,
    OrderCompletion: {sum: number},
}

const CartStacks = createNativeStackNavigator<CartParamList>();

export default function CartStack() {
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