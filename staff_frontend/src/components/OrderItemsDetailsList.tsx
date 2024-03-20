import { StyleSheet, View, Image, Text, StyleProp, ViewStyle } from 'react-native';
import { sizesMapper } from '../utils/BackendDisplayMappers';
import React from 'react';
import { orderedDrink, orderedPizza } from '../utils/AppTypes';

type Props = {
    itemList: (orderedDrink | orderedPizza)[],
    parentStyleProps?: StyleProp<ViewStyle>,
}

const OrderItemsDetailsList: React.FC<Props> = ({ itemList }) => {
    console.log("OrderItemsDetailsList render() (komponent do listowania pizz i drinków w editInterface)")
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
}

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

export default OrderItemsDetailsList;