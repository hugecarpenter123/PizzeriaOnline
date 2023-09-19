import React from "react";
import { Text, StyleSheet } from "react-native";


type ErrorMessageProps = {
    text: string
}

export default function ErrorMessage(props: ErrorMessageProps) {
    const {text} = props

    return ( 
        <Text style={styles.text} >{'*' + text}</Text>
    );
}


const styles = StyleSheet.create({
    text: {
        width: '80%',
        fontSize: 15,
        color: 'white',
        backgroundColor: 'tomato',
        margin: 5,
        padding: 5,
    }
});