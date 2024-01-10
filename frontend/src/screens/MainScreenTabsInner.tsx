import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./AppStacks";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PizzaScreen from "./Pizza/PizzaScreen";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useEffect, useContext } from "react";
import { MainScreenContext } from "../contexts/MainScreenContext";
import { AppContext } from "../contexts/AppContext";
import UserScreen from "./User/UserScreen";
import { AntDesign } from '@expo/vector-icons';
import LoginHeaderRight, { LoginState } from "../components/LoginHeaderRight";
import CartStack from "./Cart/CartStack";
import DrinkScreen from "./Drink/DrinkScreen";
import React from "react";



type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "MainScreenTabs">
}

export type TabParamList = {
    PizzaScreen: undefined,
    DrinkScreen: undefined,
    CartStack: undefined,
    UserScreen: undefined,
}

const Tab = createBottomTabNavigator<TabParamList>();

const MainScreenTabsInner = ({ navigation }: Props) => {
    const { cartItemsCount } = useContext(MainScreenContext);
    const { token, userDetails } = useContext(AppContext);

    console.log("MainScreenTabs render")

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'grey',
                tabBarStyle: {

                },
                headerStyle: {
                    backgroundColor: '#a0280e'
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 20,
                },
                headerRight: () => (
                    <LoginHeaderRight
                        loginState={token ? LoginState.LOGOUT : LoginState.LOGIN}
                        navigation={navigation}
                    />
                )
            }}
            detachInactiveScreens={true}
        >
            <Tab.Screen
                name="PizzaScreen"
                component={PizzaScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="pizza-outline" size={24} color={focused ? 'tomato' : 'grey'} />
                    ),
                    tabBarLabel: 'Pizza',
                    // headerShown: false,
                    headerTitle: '',
                }}

            />
            <Tab.Screen
                name="DrinkScreen"
                component={DrinkScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name="bottle-soda-classic-outline" size={24} color={focused ? 'tomato' : 'grey'} />
                    ),
                    tabBarLabel: 'Napoje',
                    headerTitle: '',
                }}
            />
            <Tab.Screen
                name="CartStack"
                component={CartStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Feather name="shopping-cart" size={24} color={focused ? 'tomato' : 'grey'} />
                    ),
                    tabBarLabel: 'Koszyk',
                    tabBarBadge: cartItemsCount > 0 ? cartItemsCount : undefined,
                    headerTitle: '',
                    freezeOnBlur: true
                }}
            />
            {token ?
                <Tab.Screen
                    name="UserScreen"
                    component={UserScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <AntDesign name="user" size={24} color={focused ? 'tomato' : 'grey'} />
                        ),
                        tabBarLabel: userDetails?.name,
                        headerShown: false,
                        freezeOnBlur: true
                    }}
                /> : null
            }
        </Tab.Navigator>
    );
}

export default MainScreenTabsInner;