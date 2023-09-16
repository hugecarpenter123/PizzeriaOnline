import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../screens/AppStacks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppContext } from '../contexts/AppContext';

export enum LoginState {
    LOGIN,
    LOGOUT
}

type Props = {
    loginState: LoginState
    navigation: NativeStackNavigationProp<RootStackParamList, 'MainScreen'>
}


const LoginHeaderRight = ({ loginState, navigation }: Props) => {

    const { logout } = useContext(AppContext);

    const onLoginButtonPressed = () => {
        if (loginState == LoginState.LOGOUT) {
            logout();
            // navigation.navigate('LoginScreen');
        } else {
            navigation.replace('LoginScreen');
        }
    }

    return (
        <TouchableOpacity onPress={onLoginButtonPressed}>
            <View style={styles.button}>
                <Text style={{ color: 'white', marginRight: 10 }}>
                    {
                        loginState == LoginState.LOGIN
                            ? "Zaloguj"
                            : "Wyloguj"
                    }
                </Text>
                {
                    loginState == LoginState.LOGIN
                        ? <SimpleLineIcons name="login" size={20} color="black" />
                        : <SimpleLineIcons name="logout" size={20} color="black" />
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        marginRight: 15,
        // marginVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'tomato',
        flex: 1,
        // elevation: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        // borderColor: 'black',
        // borderWidth: 1,
    }
})

export default LoginHeaderRight;