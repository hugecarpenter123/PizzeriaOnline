import React, { useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import UserInfoScreen from './UserInfoScreen';
import UserReviewsScreen from './UserReviewsScreen';
import UserOrdersScreen from './UserOrdersScreen';
import UserReviewsTabs from './UserReviewsTabs';
import useFetchUserOrders from '../../hooks/useFetchUserOrders';



export type TopTabParamList = {
    UserInfo: undefined,
    UserReviewsTabs: undefined,
    UserOrders: undefined,
}

const TopTab = createMaterialTopTabNavigator<TopTabParamList>();

const UserScreen = () => {
    return (
        <TopTab.Navigator >
            <TopTab.Screen
                component={UserInfoScreen}
                name='UserInfo'
                options={{
                    title: "Dane"
                }}
            />
            <TopTab.Screen
                component={UserReviewsTabs}
                name='UserReviewsTabs'
                options={{
                    title: "Recenzje"
                }}
            />
            <TopTab.Screen
                component={UserOrdersScreen}
                name='UserOrders'
                options={{
                    title: "Zamówienia"
                }}
            />
        </TopTab.Navigator>
    )
}

export default UserScreen;