import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import MainScreenWithContext from './MainScreenWithContext';
import { AppContext } from '../contexts/AppContext';
import { Text, View } from 'react-native';
import useAppInitializer from '../hooks/useAppInitializer';

export type RootStackParamList = {
    LoginScreen: undefined;
    RegistrationScreen: undefined;
    MainScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStacks() {
    const { token, storageDataFetched } = useContext(AppContext);
    const {appInitialized, SplashScreen} = useAppInitializer();

    // todo: improve splash screen 
    // if data from storage is not yet fetched show splashscreen until its clear whether token is or not
    if (!storageDataFetched || !appInitialized) {
        return <SplashScreen />;
    }

    return (
        <Stack.Navigator
            initialRouteName={token ? "MainScreen" : "LoginScreen"}
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
                name="MainScreen"
                component={MainScreenWithContext}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default AppStacks;