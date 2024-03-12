import React, { useContext } from 'react'
import { View, SafeAreaView, Image, StyleSheet, Text } from 'react-native'
import { MainScreenContext } from '../contexts/MainScreenContext'

type Props = {
    sum: number,
}

type CartCompletionItem = {
    imageUrl: string,
    name: string,
    quantity: number,
    size: number,
    price: number,
}

const CartCompletionItems = ({ sum }: Props) => {
    const { cart, menu } = useContext(MainScreenContext);
    const itemList = [...cart.orderedDrinkList, ...cart.orderedPizzaList];
    const pizzaSizes = ["Mała", "Średnia", "Duża"];
    const drinkSizes = ["330ml", "500ml", "1000ml"];

    const Separator: React.FC = () => {
        return (
            <View style={{ width: '100%', height: 1, backgroundColor: 'lightgrey', marginVertical: 5 }} />
        )
    }

    const Items: React.FC = () => {
        return itemList.map((item, index) => {
            const menuItem = 'pizzaId' in item
                ? menu?.pizzaList.find((x) => x.id === item.pizzaId)
                : menu?.drinkList.find((x) => x.id === item.drinkId);


            const { smallSizePrice, mediumSizePrice, bigSizePrice, imageUrl, name } = menuItem || {};
            const priceList = [smallSizePrice, mediumSizePrice, bigSizePrice];
            const price = priceList[item.size] || 0;
            const itemType = 'pizzaId' in item ? "Pizza" : 'Drink';
            const sizeLabel = itemType === "Pizza" ? pizzaSizes[item.size] : drinkSizes[item.size];

            // wypełnij propsy zdefiniowane w CartItemProps
            const cartItem: CartCompletionItem = {
                imageUrl: imageUrl || '',
                name: name || '',
                size: item.size,
                quantity: item.quantity,
                price: priceList[item.size] || 0,
            }

            // zwróć komponent, zbudowany z powyższych propsów
            return (
                <View style={styles.itemContainer} key={index}>
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>{name}</Text>
                        <Text style={styles.itemDescription}>{sizeLabel}</Text>
                        <Text style={styles.itemQuantity}>Ilość: {item.quantity}</Text>
                        <Text style={styles.itemPrice}>Cena: {price}zł</Text>
                    </View>
                </View>
            );
        });
    };

    return (
        <View style={styles.container}>
            <Items />
            <View style={styles.summary}>
                <Text style={styles.summaryText}>Razem: { sum.toFixed(2) }zł</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        paddingVertical: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 20,
        borderRadius: 50,
        resizeMode: 'cover',
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    summary: {
        marginVertical: 20,
    },
    summaryText: {
        fontSize: 20,
    }
});


export default CartCompletionItems;