import React, { useContext, useEffect, memo, useCallback } from "react";
import { SafeAreaView, StyleSheet, ToastAndroid, RefreshControl, FlatList } from "react-native";
import { MainScreenContext, OrderItemType, Pizza } from "../../contexts/MainScreenContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../AppStacks";
import ErrorMessage from "../../components/ErrorMessage";
import PizzaItem from "../../components/PizzaItem";
import { PizzaScreenParamList } from "./PizzaScreen";
import showToast from "../../utils/showToast";
import useFetchMenu from "../../hooks/useFetchMenu";

type Props = NativeStackScreenProps<PizzaScreenParamList & RootStackParamList, "PizzaList">

const PizzaList = ({ route, navigation }: Props) => {
    console.log("PizzaList render")
    // const { addOrderItem, menu, fetchMenuError, fetchMenuLoading, fetchMenu } = useContext(MainScreenContext);
    const { addOrderItem, menu } = useContext(MainScreenContext);
    const { fetchMenu, loading, error } = useFetchMenu();
    useEffect(() => {
        fetchMenu();
    }, [])

    const onRefresh = () => {
        fetchMenu();
    }

    const addToCart = useCallback(
        (pizzaId: number, size: number) => {
            addOrderItem(pizzaId, size, OrderItemType.PIZZA);
            showToast(`Dodano do koszyka`, ToastAndroid.SHORT);
        },
        []
    )

    const renderPizzaMenuItem = ({ item: pizza, index }: { item: Pizza, index: number }) => {
        console.log(`PizzaList.renderPizzaMenuItem -${index}-`)
        return <PizzaItem pizza={pizza} key={`pizza=${pizza.id}`} addToCart={addToCart} navigation={navigation} />
    }

    return (
        <SafeAreaView style={styles.container}>
            {error && <ErrorMessage text="Check connection or report the error" />}
            <FlatList data={menu?.pizzaList}
                style={styles.flatList}
                renderItem={renderPizzaMenuItem}
                keyExtractor={(_, index) => index.toString()}
                refreshControl={<RefreshControl refreshing={loading && !error} onRefresh={onRefresh} />}
            />
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
    flatList: {
        flex: 1,
        width: "100%",
    },
})

// export default memo(PizzaList);
export default PizzaList;