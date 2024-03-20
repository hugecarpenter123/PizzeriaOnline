import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./AppStacks";
import { ScrollView, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import NewOrderNotificationIcon from "../components/NewOrderNotificationIcon";
import UpdateRequestIcon from "../components/UpdateRequestIcon";
import FlatListItem from "../components/FlatListItem";
import { Order, UserOrder } from "../utils/AppTypes";
import OrderEditInterface from "../components/OrderEditInterface";
import DummyOrderData from "../utils/DummyOrderData";

type Props = NativeStackScreenProps<RootStackParamList, 'StaffMainScreen'>;

const StaffMainScreen = ({ route, navigation }: Props) => {
    console.log("StaffMainScreen render---")

    const [newOrderNotificationCount, setNewOrderNotificationCount] = useState<number>(0);
    const [updateRequestCount, setUpdateRequestCount] = useState<number>(0);
    const [newUncheckedUpdateRequests, setNewUncheckedUpdateRequests] = useState<any[] | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(DummyOrderData[0]);
    const [awaitingOrders, setAwaitingOrders] = useState<UserOrder[]>(DummyOrderData);
    const [newUncheckedOrders, setNewUncheckedOrders] = useState<UserOrder[]>([]);

    const data = useMemo(() => {
        return awaitingOrders.map((awaitingOrder) => {
            return {
                onSelect: () => onOrderItemSelect(awaitingOrder),
                dateTime: awaitingOrder.createdAt,
                orderType: awaitingOrder.orderType,
            };
        });
    }, [awaitingOrders]);


    const onOrderItemSelect = useCallback((order: UserOrder) => {
        console.log("onOrderItemSelect()")
        setSelectedOrder(order);
    }, [])

    const onUpdateRequestNotificationPress = () => {

    }

    const clearSelectedOrder = useCallback(() => {
        console.log("clearSelectedOrder()")
        setSelectedOrder(null);
    }, [])

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.notificationsContainer}>
                <NewOrderNotificationIcon notificationsCount={21} notificationItems={data} />
                <UpdateRequestIcon notificationsCount={37} onPress={onUpdateRequestNotificationPress} />
            </View>
            <View style={styles.bodyContainer}>
                <FlatList
                    data={awaitingOrders}
                    keyExtractor={((item) => item.order_id)}
                    renderItem={FlatListItem}
                    style={styles.flatList}
                />
                <OrderEditInterface
                    order={selectedOrder}
                    onClearPanel={clearSelectedOrder}
                />

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        padding: 10,
        flex: 1,
        backgroundColor: 'light-gray',
    },
    notificationsContainer: {
        flexDirection: 'row',
        backgroundColor: 'wheat',
        overflow: 'visible',
        zIndex: 1,
    },
    bodyContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    flatList: {
        backgroundColor: 'aqua',
        flexGrow: 2,
    },
    orderInterfaceContainer: {
    }
});

export default StaffMainScreen;