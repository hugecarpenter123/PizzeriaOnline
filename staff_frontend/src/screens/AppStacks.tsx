import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import useAppInitializer from '../hooks/useAppInitializer';
import LoginScreen from './LoginScreen';
import StaffMainScreen from './StaffMainScreen';
import OrderItemDetails from './OrderItemDetails';

export type RootStackParamList = {
    LoginScreen: undefined;
    RegistrationScreen: undefined;
    StaffMainScreen: undefined;
    OrderItemDetails: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStacks() {
    const { token, appInitialized: storageDataFetched } = useContext(AppContext);
    const { appInitialized, SplashScreen } = useAppInitializer();

    if (!storageDataFetched || !appInitialized) {
        return <SplashScreen />;
    }

    return (
        <Stack.Navigator
            initialRouteName={"LoginScreen"}
        >
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ title: 'Logowanie', headerShown: false }}
            />
            <Stack.Screen
                name="StaffMainScreen"
                component={StaffMainScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OrderItemDetails"
                component={OrderItemDetails}
            />
        </Stack.Navigator>
    );
}

export default AppStacks;