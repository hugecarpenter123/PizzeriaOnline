import React from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import { UserOrder } from '../contexts/MainScreenContext'

type Props = {
    order: UserOrder,
}

// TODO: simplify in the backend the division between drinks and pizzas to maybe one list
const OrderHistoryItems = ({ order }: Props) => {
    const itemList = [...order.orderedDrinks, ...order.orderedPizzas];

    // keys comes from backend, here it can be mapped to any display value
    const sizesMapper: {[key: string]: string} = {
        "SMALL": "Mała",
        "MEDIUM": "Średnia",
        "BIG": "Duża",
        "Small (330ml)": "330ml",
        "Medium (500ml)": "500ml",
        "Big (1000ml)": "1000ml",
    }

    const orderTypeMapper = {
        "DELIVERY": "Dostawa",
        "PICKUP": "Odbiór osobisty"
    }

    const Separator: React.FC = () => {
        return (
            <View style={{ width: '100%', height: 1, backgroundColor: 'lightgrey', marginVertical: 5 }} />
        )
    }

    const Items: React.FC = () => {
        return itemList.map((orderItem, index) => {
            return (
                <View style={styles.itemContainer} key={index}>
                    <Image source={{ uri: orderItem.imageUrl }} style={styles.image} />
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>{orderItem.name}</Text>
                        <Text style={styles.itemDescription}>{sizesMapper[orderItem.size]}</Text>
                        <Text style={styles.itemQuantity}>Ilość: {orderItem.quantity}</Text>
                    </View>
                </View>
            );
        });
    };

    return (
        <View style={styles.container}>
            <Items />
            <View style={styles.summary}>
                <Text>Zamawiający: <Text style={styles.bold}>{order.ordererName}</Text></Text>
                <Text>Adres: <Text style={styles.bold}>{order.deliveryAddress}</Text></Text>
                <Text>Odbiór: <Text style={styles.bold}>{orderTypeMapper[order.orderType]}</Text></Text>
                <Text style={styles.summaryText}>Razem: <Text style={styles.bold}>{order.total}zł</Text></Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
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
        marginBottom: 2,
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    summary: {
        marginTop: 10,
    },
    summaryText: {
        fontSize: 15,
    },
    bold: {
        fontWeight: 'bold',
    }
});


export default OrderHistoryItems;