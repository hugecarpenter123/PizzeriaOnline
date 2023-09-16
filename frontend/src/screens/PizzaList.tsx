import React, { useContext, useState, useEffect, memo } from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid, RefreshControl, ScrollView, StatusBar } from "react-native";
import { MainScreenContext, OrderItemType } from "../contexts/MainScreenContext";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./AppStacks";
import { TabParamList } from "./MainScreen";
import ErrorMessage from "../components/ErrorMessage";
import PizzaItem from "../components/PizzaItem";
import { PizzaSizes } from "../contexts/MainScreenContext";
import useMenuFetcher from "../hooks/useMenuFetcher";
import { PizzaScreenParamList } from "./PizzaScreen";
import showToast from "../utils/showToast";
import { AppContext } from "../contexts/AppContext";

type Props = NativeStackScreenProps<PizzaScreenParamList & RootStackParamList, "PizzaList">

const PizzaList = ({ route, navigation }: Props) => {
    // console.log("PizzaList render()");
    const { cart, addOrderItem, menu, error, setError, menuFetched } = useContext(MainScreenContext);
    const { fetchMenu } = useMenuFetcher();

    useEffect(() => {
        if (error) {
            showToast(error, ToastAndroid.LONG);
        }
    }, [error])

    const onRefresh = () => {
        setError('');
        fetchMenu();
    }

    // method exist in order to pass data to MainScreenContext, show toast, and update cart icon image with (notifier)
    const addToCart = (pizzaId: number, size: number) => {
        addOrderItem(pizzaId, size, OrderItemType.PIZZA);
        showToast(`Dodano do koszyka`, ToastAndroid.SHORT);
    }

    const renderPizzaMenu = () => {
        return menu?.pizzaList.map(pizza => (
            <PizzaItem pizza={pizza} key={`pizza=${pizza.id}`} addToCart={addToCart} navigation={navigation} />
        ))
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={!menuFetched && !error} onRefresh={onRefresh} />}
            >
                {error && <ErrorMessage text="Check connection or report the error" />}
                {menu && renderPizzaMenu()}
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "cream",
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
        width: "100%",
    },
})

export default memo(PizzaList);