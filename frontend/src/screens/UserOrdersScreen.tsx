import React, { useContext, useState } from 'react';
import { SafeAreaView, Text, View, FlatList, StyleSheet } from 'react-native';
import OrderListItem from '../components/OrderListItem';
import { MainScreenContext, UserOrder } from '../contexts/MainScreenContext';
import useFetchUserOrders from '../hooks/useFetchUserOrders';
import { RefreshControl } from 'react-native-gesture-handler';


export default function UserOrdersScreen() {

    const { userOrders } = useContext(MainScreenContext);
    const { fetchUserOrders, loading } = useFetchUserOrders();

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={styles.flatList}
                data={userOrders}
                keyExtractor={(item) => item.order_id.toString()}
                renderItem={({ item }) => (
                    <OrderListItem order={item} />
                )}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchUserOrders} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    flatList: {
    },
});