import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import ConfirmationPopup from "./ConfirmationPopup";
import useDeleteAccount from "../hooks/useDeleteAccount";
import LoadingIndicator from "./LoadingIndicator";
import ForceLogout from "../utils/ForceLogout";

const UserInfoBottom = () => {
    const [showPopup, setShowPopup] = useState(false);
    const {loading, deleteAccount} = useDeleteAccount();

    // popup related -----------
    const onDeleteAccPressed = () => {
        setShowPopup(true);
    }   

    const handleYes = () => {
        setShowPopup(false);
        deleteAccount();
    };

    const handleNo = () => {
        setShowPopup(false);
    };
    // END popup related -------

    const onLogoutPressed = () => {
        ForceLogout();
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button, styles.delete]} onPress={onDeleteAccPressed}>
                <Text style={styles.text}>Usuń konto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.logout]} onPress={onLogoutPressed}>
                <Text style={styles.text}>Wyloguj</Text>
            </TouchableOpacity>
            <ConfirmationPopup
                isVisible={showPopup}
                message="Na pewno usunąć konto na zawsze?"
                onYes={handleYes}
                onNo={handleNo}
            />
            {loading && <LoadingIndicator />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        alignItems: 'center',
        gap: 10,
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
    },
    delete: {
        backgroundColor: 'red',
    },
    logout: {
        backgroundColor: '#c6cb25',
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#F7F7F7',
    }
})

export default UserInfoBottom;