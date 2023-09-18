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

    // if fetch is successfull, show message
    useEffect(() => {
        if (success) {
            showToast("Zalogowano", 0);
            navigation.replace("MainScreen");
        }
    }, [success])

    // don't annoy the user with previous floating errors
    useEffect(() => {
        setLoginError('');
        setPasswordError('');
    }, [login, password])

    const onRegistrationSwitchPressed = () => {
        navigation.replace('RegistrationScreen')
    }

    const onContinueUnloggedPressed = (): void => {
        navigation.replace("MainScreen");
    }

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
            <View style={styles.imageContainer}>
                <Image style={styles.img} source={require('../../assets/images/login-img.png')} />
            </View>
            {loginError && <Text style={styles.errorText}>{loginError}</Text>}
            <TextInput
                style={[
                    styles.input,
                    loginError ? { borderColor: "red" } : null,
                    // colorScheme === 'dark' ? commonStyles.darkThemeText : commonStyles.lightThemeText
                ]}
                onChangeText={setLogin}
                placeholder="Login"
            />
            {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
            <TextInput
                style={[
                    styles.input,
                    passwordError ? { borderColor: "red" } : null,
                    // colorScheme === 'dark' ? commonStyles.darkThemeText : commonStyles.lightThemeText
                ]}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={onLoginPressed}>
                <Text style={styles.buttonText}>Zaloguj</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.coonitueButton} onPress={onContinueUnloggedPressed}>
                <Text style={styles.buttonText}>Kontynuuję bez logowania</Text>
                <Entypo name="arrow-bold-right" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={onRegistrationSwitchPressed}>
                <Text style={styles.buttonText}>Załóż konto</Text>
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
        width: '90%',
        backgroundColor: 'tomato',
        padding: 12,
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
        backgroundColor: 'transparent', // Set the container's background color to transparent
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