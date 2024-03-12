import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const LoadingIndicator = () => {
    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color="blue" />
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default LoadingIndicator;