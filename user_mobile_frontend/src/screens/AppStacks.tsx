import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import MainScreenTabs from './MainScreenTabs';
import { AppContext } from '../contexts/AppContext';
import { Text, View } from 'react-native';
import useAppInitializer from '../hooks/useAppInitializer';

export type RootStackParamList = {
    LoginScreen: undefined;
    RegistrationScreen: undefined;
    MainScreenTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStacks() {
    const { token, storageDataFetched } = useContext(AppContext);
    const {appInitialized, SplashScreen} = useAppInitializer();

    if (!storageDataFetched || !appInitialized) {
        return <SplashScreen />;
    }

    return (
        <Stack.Navigator
            initialRouteName={token ? "MainScreenTabs" : "LoginScreen"}
        >   
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{ title: 'Logowanie', headerShown: false }}
            />
            <Stack.Screen
                name="RegistrationScreen"
                component={RegistrationScreen}
                options={{ title: 'Rejestracja', headerShown: false }}
            />
            <Stack.Screen
                name="MainScreenTabs"
                component={MainScreenTabs}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default AppStacks;