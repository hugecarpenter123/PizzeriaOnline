import React, { useContext, useState, useEffect, useMemo } from "react";
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CartItem, { CartItemProps } from "../../components/CartItem";
import { MainScreenContext, OrderItemType, OrderRemoveType, Pizza, orderedDrink, orderedPizza } from "../../contexts/MainScreenContext";
import { Ionicons } from '@expo/vector-icons';
import ConfirmationPopup from "../../components/ConfirmationPopup";
import { CartParamList } from "./CartStack";

type Props = NativeStackScreenProps<CartParamList, 'Cart'>;

const CartScreen = ({ route, navigation }: Props) => {
    console.log("CartScreen render")

    const { cart, clearCart, menu, addOrderItem, removeOrderItem } = useContext(MainScreenContext);
    const [sum, setSum] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    
    const data = useMemo(() => [...cart.orderedDrinkList, ...cart.orderedPizzaList], [cart]);

    useEffect(() => {
        console.log("CartScreen.useEffect()[data, menu]")
        // Calculate the total sum
        const totalSum = data.reduce((sum, item) => {
            const menuItem = "pizzaId" in item
                ? menu?.pizzaList.find((x) => x.id === item.pizzaId)
                : menu?.drinkList.find((x) => x.id === item.drinkId);
            const sizePriceList = [menuItem?.smallSizePrice, menuItem?.mediumSizePrice, menuItem?.bigSizePrice];
            const price = sizePriceList[item.size] || 0;
            return sum + price * item.quantity;
        }, 0);

        // Update the state with the total sum
        setSum(totalSum);
    }, [data, menu]);

    useEffect(() => {
        console.log("CartScreen.useEffect()[cart]")
    }, [cart])

    // flat list related =====================================================

    const keyExtractor = (item: orderedPizza | orderedDrink) => {
        if ('pizzaId' in item) {
            return `p-${item.pizzaId}-${item.size}`
        } else {
            return `d-${item.drinkId}-${item.size}`
        }
    }
    const separatorComponent = () => (<View style={styles.separator}></View>)
    const emptyListComponent = () => (<Text style={{ alignSelf: 'center'}}>Brak zamówień</Text>)

    // END flat list related ==================================================
    type ItemProps = {
        item: orderedPizza | orderedDrink
        index: number
    }

    const pizzaSizes = ["Mała", "Średnia", "Duża"]
    const drinkSizes = ["330ml", "500ml", "1000ml"]

    const renderItem = ({ item, index }: ItemProps) => {
        console.log(`CartScreen.renderItem -${index}-`)
        // Use destructuring and optional chaining for menuItem
        const menuItem = 'pizzaId' in item
            ? menu?.pizzaList.find((x) => x.id === item.pizzaId)
            : menu?.drinkList.find((x) => x.id === item.drinkId);

        const { smallSizePrice, mediumSizePrice, bigSizePrice, imageUrl, name } = menuItem || {};
        const priceList = [smallSizePrice, mediumSizePrice, bigSizePrice];


        // wypełnij propsy zdefiniowane w CartItemProps
        const cartItem: CartItemProps = {
            type: "pizzaId" in item ? OrderItemType.PIZZA : OrderItemType.DRINK,
            imageUrl: imageUrl || '',
            name: name || '',
            size: item.size,
            quantity: item.quantity,
            price: priceList[item.size] || 0,
            increase: () => addOrderItem(menuItem?.id || 0, item.size, "pizzaId" in item ? OrderItemType.PIZZA : OrderItemType.DRINK),
            decrease: () => removeOrderItem(menuItem?.id || 0, "pizzaId" in item ? OrderItemType.PIZZA : OrderItemType.DRINK, item.size, OrderRemoveType.SINGLE),
            delete: () => removeOrderItem(menuItem?.id || 0, "pizzaId" in item ? OrderItemType.PIZZA : OrderItemType.DRINK, item.size, OrderRemoveType.ALL)
        }

        // zwróć komponent, zbudowany z powyższych propsów
        return (
            <CartItem item={cartItem} />
        )
    }

    const onSwitchToCompletionPressed = () => {
        navigation.navigate('OrderCompletion', {sum})
    }

    // popup related -----------
    const onClearCartPressed = () => {
        setShowPopup(true);
    }

    const handleYes = () => {
        clearCart();
        setShowPopup(false);
    };

    const handleNo = () => {
        setShowPopup(false);
    };
    // END popup related -------

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.flatListContainer}>
                <FlatList
                    data={[...cart.orderedDrinkList, ...cart.orderedPizzaList]}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    ItemSeparatorComponent={separatorComponent}
                    ListEmptyComponent={emptyListComponent}
                    style={styles.flatList}
                />
            </View>
            {data.length > 0 &&
                <View style={styles.summaryContainer}>
                    <View style={styles.separator} />
                    <Text style={styles.sumText}>Łącznie: {sum.toFixed(2)} zł</Text>
                    <View style={styles.buttonPanel}>
                        <TouchableOpacity onPress={onClearCartPressed}>
                            <Ionicons name="trash-bin" size={34} color="tomato" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={onSwitchToCompletionPressed} >
                            <Text style={styles.buttonText}>Zamów</Text>
                        </TouchableOpacity>
                    </View>
                </View>}

            {/* conditional popup regarding deleting all cart content */}
            <ConfirmationPopup
                isVisible={showPopup}
                message="Wyczyścić zamówienie?"
                onYes={handleYes}
                onNo={handleNo}
            />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    flatListContainer: {
        width: '100%',
        maxHeight: '84%',
    },
    flatList: {
        width: '100%',
        height: 'auto',
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: 'grey',
        width: '100%',
    },
    summaryContainer: {
        marginTop: 10,
        gap: 10,
        alignSelf: 'flex-end',
        width: '50%',
        alignItems: 'flex-end',
    },
    sumText: {
        marginRight: 20,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        backgroundColor: "green",
        borderRadius: 5,
        marginRight: 20,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        padding: 10,
    },
    buttonPanel: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
})


export default CartScreen;