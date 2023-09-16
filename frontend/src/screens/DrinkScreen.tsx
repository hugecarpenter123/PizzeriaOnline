import React, { useContext, useState, memo } from "react";
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { MainScreenContext } from "../contexts/MainScreenContext";
import DrinkItem from "../components/DrinkItem";
import { Drink } from "../contexts/MainScreenContext";
import useMenuFetcher from "../hooks/useMenuFetcher";

const DrinkScreen = () => {
    // console.log("DrinkScreen render()");
    
    const { menu, menuFetched, error } = useContext(MainScreenContext);
    const { fetchMenu } = useMenuFetcher();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                style={styles.drinkList}
                refreshControl={<RefreshControl refreshing={!menuFetched && !error} onRefresh={fetchMenu} />}  
            >
                {menu?.drinkList.map((drink: Drink) => (
                    <DrinkItem key={`drink-${drink.id}`} drink={drink} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    drinkList: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 10,
    },
});

export default memo(DrinkScreen)