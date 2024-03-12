import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, Text, View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import OrderListItem from '../../components/OrderListItem';
import { MainScreenContext, UserOrder } from '../../contexts/MainScreenContext';
import useFetchUserOrders from '../../hooks/useFetchUserOrders';


export default function UserOrdersScreen() {
    console.log("UserOrdersScreen render")
    const { userOrders } = useContext(MainScreenContext);
    const { fetchUserOrders, loading, error } = useFetchUserOrders();

    useEffect(() => {
        fetchUserOrders();
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={styles.flatList}
                data={userOrders}
                keyExtractor={(item) => item.orderId.toString()}
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
        flex: 1,
    },
    flatList: {
    },
});