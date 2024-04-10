import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./AppStacks";
import { ScrollView, FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import NewOrderNotificationIcon from "../components/NewOrderNotificationIcon";
import UpdateRequestIcon from "../components/UpdateRequestIcon";
import MainOrdersListItem from "../components/MainOrdersListItem";
import { Order } from "../utils/AppTypes";
import OrderEditInterface from "../components/OrderEditInterface";
import DummyOrderData from "../utils/DummyOrderData";
import useFetchOrders from "../hooks/useFetchOrders";
import LogoutIcon from "../components/LogoutIcon";
import useOrdersListener from "../hooks/useOrdersListener";
import useOrderSubscription from "../hooks/useOrderSubscription";
import useOrdersListener2 from "../hooks/useOrdersListener2";

type Props = NativeStackScreenProps<RootStackParamList, 'StaffMainScreen'>;

const StaffMainScreen = ({ route, navigation }: Props) => {
    // console.log("StaffMainScreen()")

    /** TODO: implement */
    const [newUncheckedUpdateRequests, setNewUncheckedUpdateRequests] = useState<any[]>([]);

    /**
     * State is used in:
     * -EditInterfaceComponent to dispaly order details
     * -main order list, to highlight currently selected order
     */
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    /**
     * State containing  all awaiting orders.
     */
    const [awaitingOrders, setAwaitingOrders] = useState<Order[]>([]);

    /**
     * State of all unchecked by staff member newly arrived orders. State is used to:
     * -highlight given orders in the main list
     * -display in notification component as a list of selectable list items
     * -delete highlight from list item when clicked for the first time
     */
    const [newUncheckedOrders, setNewUncheckedOrders] = useState<Order[]>([]);
    const { loading, fetchOrders } = useFetchOrders();

    /**
     * Memoized variable that is passed as a prop to navigation icon component which displays
     * the formatted data in form of a FlatList and enables selecting from there.
     */
    const notificationOrdersData = useMemo(() => {
        console.log("data for notification component is being calculated...")
        return newUncheckedOrders.map((order) => {
            return {
                onSelect: () => onOrderItemSelect(order),
                dateTime: order.createdAt,
                orderType: order.orderType,
            };
        });
    }, [newUncheckedOrders]);

    // const { subscribe } = useOrdersListener();
    const { subscribe } = useOrdersListener2();
    // const { subscribe } = useOrderSubscription();

    /**
     * OnMount method that fetches all orders, sets them to both unchecked and awaiting orders states.
     */
    useEffect(() => {
        const callback = (orders: Order[]) => {
            setAwaitingOrders(orders);
            setNewUncheckedOrders(orders);
        }
        fetchOrders(callback);

        const updateState = (order: Order) => setNewUncheckedOrders((prev) => [...prev, order]);
        subscribe(updateState);

    }, [])


    /**
     * after selecting (in any way) an order, it sets the "selectedOrder" status. 
     * As a result, it highlights the item on the main list, displays the data in the edit panel and
     * if the order is opened for the first time, removes the order from the "newUncheckedOrders" state
     */
    const onOrderItemSelect = useCallback((newSelectedOrder: Order) => {
        console.log("onOrderItemSelect()")
        setSelectedOrder(newSelectedOrder);
        setNewUncheckedOrders((uncheckedOrders) => uncheckedOrders.filter(uncheckedOrder => uncheckedOrder.orderId !== newSelectedOrder.orderId));
    }, [])

    // TODO: to implement
    const onUpdateRequestNotificationPress = () => {

    }

    const clearSelectedOrder = useCallback(() => {
        setSelectedOrder(null);
    }, [])

    const isListItemUnchecked = useCallback((listItem: Order) => {
        return newUncheckedOrders.find((uncheckedOrder) => uncheckedOrder.orderId === listItem.orderId) != undefined;
    }, [newUncheckedOrders]);

    const isOrderCurrentlySelected = useCallback((order: Order) => {
        return selectedOrder != null && selectedOrder.orderId === order.orderId;
    }, [selectedOrder])


    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.navPanel}>
                <View style={styles.notificationContainer}>
                    <NewOrderNotificationIcon notificationsCount={newUncheckedOrders.length} notificationItems={notificationOrdersData} />
                    <UpdateRequestIcon notificationsCount={newUncheckedUpdateRequests.length} onPress={onUpdateRequestNotificationPress} />
                </View>
                <View>
                    <LogoutIcon />
                </View>
            </View>
            <View style={styles.bodyContainer}>
                <FlatList
                    data={awaitingOrders}
                    keyExtractor={(item, index) => item.orderId}
                    renderItem={({ item, index }) => (
                        <MainOrdersListItem
                            item={item}
                            key={index}
                            isUnchecked={isListItemUnchecked(item)}
                            onPress={() => onOrderItemSelect(item)}
                            isSelected={isOrderCurrentlySelected(item)}
                        />
                    )}
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
    navPanel: {
        flexDirection: 'row',
        backgroundColor: 'wheat',

        borderWidth: 2,
        borderColor: '#c2ad44',
        borderRadius: 2,
        padding: 2,

        overflow: 'visible',
        zIndex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bodyContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
    },
    flatList: {
        // backgroundColor: 'aqua',
        flexGrow: 2,
        marginEnd: 5,
    },
    orderInterfaceContainer: {
        // backgroundColor: 'pink',
    },
    notificationContainer: {
        flexDirection: 'row',
    },
    utilityContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    }
});

export default StaffMainScreen;