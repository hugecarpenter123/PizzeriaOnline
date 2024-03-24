import { AntDesign } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AppContext } from '../contexts/AppContext';
import { useNavigation } from '@react-navigation/native';
import useForceLogout from '../hooks/useForceLogout';

interface LogoutIconProps {}

const LogoutIcon: React.FC<LogoutIconProps> = () => {
    const logout = useForceLogout();
    return (
        <TouchableOpacity
            onPress={logout}
            style={styles.container}
            activeOpacity={0.6}
        >
            <AntDesign name="logout" size={30} color="black" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 5,
    },
});

export default LogoutIcon;
