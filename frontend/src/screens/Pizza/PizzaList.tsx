import React, { useContext, useEffect, memo, useCallback } from "react";
import { SafeAreaView, StyleSheet, ToastAndroid, RefreshControl } from "react-native";
import { MainScreenContext, OrderItemType, Pizza } from "../../contexts/MainScreenContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../AppStacks";
import ErrorMessage from "../../components/ErrorMessage";
import PizzaItem from "../../components/PizzaItem";
import { PizzaScreenParamList } from "./PizzaScreen";
import showToast from "../../utils/showToast";
import { FlatList } from "react-native-gesture-handler";

type Props = NativeStackScreenProps<PizzaScreenParamList & RootStackParamList, "PizzaList">

const PizzaList = ({ route, navigation }: Props) => {
    console.log("PizzaList render")
    const { addOrderItem, menu, fetchMenuError, fetchMenuLoading, fetchMenu } = useContext(MainScreenContext);

    useEffect(() => {
        if (fetchMenuError) {
            showToast(fetchMenuError, ToastAndroid.LONG);
        }
    }, [fetchMenuError])

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
            {fetchMenuError && <ErrorMessage text="Check connection or report the error" />}
            <FlatList data={menu?.pizzaList}
                style={styles.flatList}
                renderItem={renderPizzaMenuItem}
                keyExtractor={(_, index) => index.toString()}
                refreshControl={<RefreshControl refreshing={fetchMenuLoading && !fetchMenuError} onRefresh={onRefresh} />}
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