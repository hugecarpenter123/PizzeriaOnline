import React, { useState, useEffect, useContext } from "react";
import { Image, View, Text, StyleSheet, TouchableOpacity, TextInput, useColorScheme } from "react-native";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "./AppStacks";
import useLogin from "../hooks/useLogin";
import LoadingIndicator from "../components/LoadingIndicator";
import showToast from "../utils/showToast";
import { Entypo } from '@expo/vector-icons';
import { commonStyles } from "../utils/StaticAppInfo";

type Props = NativeStackScreenProps<RootStackParamList, 'LoginScreen'>;

export default function LoginScreen({ route, navigation }: Props) {
    console.log("LoginScreen render")
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('')
    const { loading, success, error, loginRequest } = useLogin();
    const [loginError, setLoginError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    // const colorScheme = useColorScheme();

    useEffect(() => {
        if (error) {
            showToast(error, 0)
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            showToast("Zalogowano", 0);
            navigation.replace("StaffMainScreen");
        }
    }, [success])

    useEffect(() => {
        setLoginError('');
        setPasswordError('');
    }, [login, password])

    const validateInputs = () => {
        let areInputsValid = true;
        if (!login) {
            setLoginError("Pole nie może być puste");
            areInputsValid = false
        }
        if (!password) {
            setPasswordError("Pole nie może być puste");
            areInputsValid = false
        }

        return areInputsValid;
    }

    const onLoginPressed = () => {
        navigation.replace("StaffMainScreen")
        if (!validateInputs()) {
            return;
        }
        const loginData = {
            email: login,
            password
        }
        loginRequest(loginData);
    }
    return (
        <View style={styles.container}>
            {/* <View style={styles.imageContainer}>
                <Image style={styles.img} source={require('../../assets/images/login-img.png')} />
            </View> */}
            {loginError && <Text style={styles.errorText}>{loginError}</Text>}
            <TextInput
                style={[
                    styles.input,
                    loginError ? { borderColor: "red" } : null,
                ]}
                onChangeText={setLogin}
                placeholder="Login"
            />
            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            <TextInput
                style={[
                    styles.input,
                    passwordError ? { borderColor: "red" } : null,
                ]}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={onLoginPressed}>
                <Text style={styles.buttonText}>Zaloguj</Text>
            </TouchableOpacity>

            {loading && <LoadingIndicator />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: 5,
    },
    coonitueButton: {
        marginTop: 10,
        backgroundColor: 'lightblue',
        width: '90%',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerButton: {
        marginTop: 10,
        backgroundColor: 'lightgreen',
        width: '60%',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center'
    },
    button: {
        width: 'auto',
        backgroundColor: 'tomato',
        padding: 12,
        paddingHorizontal: '5%',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    imageContainer: {
        backgroundColor: 'transparent',
    },
    img: {
        height: 70,
        width: 120,
        alignSelf: 'center',
        backgroundColor: 'transparent',
        marginBottom: 50,
        resizeMode: 'contain'
    },
});