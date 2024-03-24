import React from "react";
import { ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle, TouchableOpacity } from "react-native";
import { Order } from "../utils/AppTypes";
import { FontAwesome } from '@expo/vector-icons';
import { dateTimeParser, orderTypeMapper, statusMapper } from "../utils/BackendDisplayMappers";
import OrderItemsDetailsList from "./OrderItemsDetailsList";

type Props = {
    containerStyle?: StyleProp<ViewStyle>,
    order: Order | null,
    onClearPanel: () => void,
}

const OrderEditInterface: React.FC<Props> = ({ containerStyle, order, onClearPanel }) => {
    console.log("OrderEditInterface render()");

    if (order) {
        console.log("OrderEditInterface if(order)")
        const displayMap = statusMapper[order.orderStatus];
        const statusColor = displayMap.color;
        const statusLabel = displayMap.label;
        const formattedDateTime = dateTimeParser(order.createdAt);
        const orderItemsList = [...order.orderedPizzas, ...order.orderedDrinks];

        return (
            <ScrollView style={[styles.mainContainer, containerStyle]}>
                <TouchableOpacity
                    onPress={onClearPanel}
                    style={[]}
                    activeOpacity={0.5}
                >
                    <FontAwesome name="arrow-left" size={30} color="black" style={styles.removeIcon} />
                </TouchableOpacity>
                <View style={styles.row}>
                    <Text style={[styles.bold, styles.text]}>Nr zamówienia: </Text>
                    <Text style={[styles.text]}>{order.orderId}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.bold, styles.text]}>Czas złożenia zamówienia: </Text>
                    <Text style={[styles.text]}>{formattedDateTime}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={[styles.bold, styles.text]}>Odbiór: </Text>
                    <Text style={[styles.orderType, styles.text]}>{orderTypeMapper[order.orderType]}</Text>
                </View>
                <View style={styles.col}>
                    <Text style={[styles.bold, styles.text]}>Dane kontaktowe/dostawy: </Text>
                    <Text style={[styles.text]}>{order.ordererName}</Text>
                    {order.deliveryAddress && <Text style={[styles.text]}>{order.deliveryAddress}</Text>}
                    <Text style={[styles.text]}>{order.phone}</Text>
                </View>
                <View style={[styles.row, { marginBottom: 20 }]}>
                    <Text style={[styles.bold, styles.text]}>Status: </Text>
                    <Text style={[styles.status, styles.text, { color: statusColor }]}>{statusLabel}</Text>
                </View>
                <Text style={styles.headerCenter}>Zamówienie</Text>
                <OrderItemsDetailsList itemList={orderItemsList} />

            </ScrollView>
        )
    }

    return (
        <View style={[styles.mainContainer, containerStyle]}>
            <Text>Nie wybrano</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
    },
    mainContainer: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        // backgroundColor: 'lightgray',
        flex: 1,
    },
    noOrderText: {
        textAlign: 'center',
    },
    removeIcon: {
        margin: 5,
        marginBottom: 10
    },
    row: {
        flexDirection: 'row',
        marginVertical: 3,
    },
    date: {

    },
    orderType: {

    },
    status: {

    },
    bold: {
        fontWeight: 'bold',
    },
    col: {
        flexDirection: 'column',
        marginVertical: 2,
    },
    headerCenter: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        marginVertical: 10,
    }

});

export default OrderEditInterface;