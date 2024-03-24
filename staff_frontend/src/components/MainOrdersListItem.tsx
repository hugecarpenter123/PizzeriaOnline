import React, { memo } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Order } from "../utils/AppTypes";
import { Ionicons } from '@expo/vector-icons';
import { dateTimeParser, orderTypeMapper, statusMapper } from "../utils/BackendDisplayMappers";

export type Props = {
    item: Order,
    isUnchecked: boolean,
    onPress: () => void,
    isSelected: boolean,
}

const MainOrdersListItem: React.FC<Props> = ({ item, isUnchecked, onPress, isSelected }) => {
    const { color, label } = statusMapper[item.orderStatus];
    const orderType = orderTypeMapper[item.orderType];
    const dateDisplay = dateTimeParser(item.createdAt)
    // console.log(`=======MainOrdersListItem render():\n\t-orderId${item.orderId}\n\t-selected?: ${isSelected}\n\t-isUnchecked ${isUnchecked}`)
    return (
        <TouchableOpacity
            style={[styles.itemContainer, isUnchecked && styles.unchecked, isSelected && styles.selected]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.leftContainer}>
                <Text style={styles.orderId}>{item.orderId}</Text>
                <Text>{`Pizza: ${item.orderedPizzas.map(p => p.name).join(", ")}`}</Text>
                <Text>{`Napoje: ${item.orderedDrinks.map(d => d.name).join(", ")}`}</Text>
                <Text>Status: <Text style={{ color }}>{label}</Text></Text>
                <Text>{`Rodzaj odbioru: ${orderType}`}</Text>
                <Text>{`Data zamówienia: ${dateDisplay}`}</Text>
            </View>
            {isUnchecked && (
                <View style={styles.iconContainer}>
                    <Text style={styles.alertText}>Nowe zamówienie</Text>
                    <Ionicons name="alert-circle" size={28} color="tomato" />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
    },
    unchecked: {
        borderColor: 'red',
        shadowColor: 'tomato',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 3,
        backgroundColor: 'beige'
    },
    leftContainer: {
        flex: 1,
    },
    orderId: {
        fontWeight: 'bold',
    },
    iconContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        top: 5,
        right: 5,
    },
    alertText: {
        color: 'tomato',
        marginRight: 10,
        fontSize: 15,
    },
    selected: {
        backgroundColor: 'lightblue',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default MainOrdersListItem;