import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type AppButtonProps = {
    text: string,
    onPressHandler: () => void
}

export default function AppButton(props: AppButtonProps) {
    const {text, onPressHandler} = props

    return ( 
        <TouchableOpacity style={styles.button} onPress={onPressHandler}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    button: {
        width: '60%',
        backgroundColor: 'green',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        borderColor: 'darkgreen',
        borderWidth: 1,
    },
    text: {
        fontSize: 15
    }
});