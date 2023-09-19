import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./AppStacks";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PizzaScreen from "./PizzaScreen";
import DrinkScreen from "./DrinkScreen";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useEffect, useContext } from "react";
import { MainScreenContext } from "../contexts/MainScreenContext";
import useMenuFetcher from "../hooks/useMenuFetcher";
import { AppContext } from "../contexts/AppContext";
import UserScreen from "./UserScreen";
import { AntDesign } from '@expo/vector-icons';
import LoginHeaderRight, { LoginState } from "../components/LoginHeaderRight";
import CartStack from "./Cart/CartStack";
import useFetchUserOrders from "../hooks/useFetchUserOrders";

type Props = NativeStackScreenProps<RootStackParamList, 'MainScreen'>;

export type TabParamList = {
    PizzaScreen: undefined,
    DrinkScreen: undefined,
    CartStack: undefined,
    UserScreen: undefined,
}

const Tab = createBottomTabNavigator<TabParamList>();

function MainScreen({ route, navigation }: Props) {

    const { cartItemsCount } = useContext(MainScreenContext);
    const { token, userDetails } = useContext(AppContext);
    const { fetchUserOrders } = useFetchUserOrders();
    const { fetchMenu } = useMenuFetcher();

    useEffect(() => {
        // fetch menu always, token not required
        fetchMenu();
        
        if (token) {
            fetchUserOrders();
        }
    }, []);

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
                    }}
                /> : null
            }
        </Tab.Navigator>
    );
}

export default MainScreen;