import React, { useContext, useCallback } from "react";
import { SafeAreaView, StyleSheet, RefreshControl, Text, ToastAndroid } from "react-native";
import { MainScreenContext, OrderItemType } from "../../contexts/MainScreenContext";
import DrinkItem from "../../components/DrinkItem";
import { Drink } from "../../contexts/MainScreenContext";
import { FlatList } from "react-native-gesture-handler";
import showToast from "../../utils/showToast";

const DrinkScreen = () => {
    console.log("DrinkScreen render");
    const { menu, fetchMenuLoading, fetchMenuError, fetchMenu, addOrderItem } = useContext(MainScreenContext)

    const onAddToOrderClick = useCallback(
        (drinkId: number, size: number) => {
            addOrderItem(drinkId, OrderItemType.DRINK, size);
            showToast("Dodano do zamówienia", ToastAndroid.SHORT);
        },
        []
    )

    const renderDrinkItem = ({ item: drink }: { item: Drink }) => {
        console.log(`drinkItem-${drink.id}- renders`)
        return <DrinkItem key={`drink-${drink.id}`} drink={drink} onAddToOrderClick={onAddToOrderClick} />
    }

    const emptyListComponent = () => (<Text style={{ alignSelf: 'center' }}>Brak dostępnych informacji.</Text>)

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={menu?.drinkList}
                renderItem={renderDrinkItem}
                keyExtractor={(_, index) => index.toString()}
                style={styles.drinkList}
                ListEmptyComponent={emptyListComponent}
                refreshControl={<RefreshControl refreshing={fetchMenuLoading && !fetchMenuError} onRefresh={fetchMenu} />}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    drinkList: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 10,
    },
});

// export default memo(DrinkScreen)
export default DrinkScreen;