import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import Validation from '../utils/validation';
import useUpdateUser, { UserModel } from '../hooks/useUpdateUser';
import { commonStyles } from '../utils/StaticAppInfo';


type Props = {
    setLoading: (loading: boolean) => void,
}

export default function AccountEditFields({ setLoading }: Props) {
    const [oldPassword, setOldPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');

    const [oldPasswordError, setOldPasswordError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordError2, setPasswordError2] = useState<string | null>(null);
    
    const { update, loading } = useUpdateUser();

    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? commonStyles.darkThemeText : commonStyles.lightThemeText;

    useEffect(() => {
        if (password2 && !passwordError2) {
            if (password !== password2) {
                setPasswordError2("Hasła muszą być takie same");
            }
        } else if (password2 && passwordError2) {
            if (password === password2) {
                setPasswordError2(null);
            }
        }
    }, [password, password2]);

    const fields = ["oldPassword", "password", "password2"]
    const labels = ["Stare Hasło", "Nowe hasło", "Powtórz hasło"]

    const onChange = (field: string, value: string) => {
        switch (field) {
            case fields[0]:
                setOldPassword(value);
                break;
            case fields[1]:
                setPassword(value);
                setPasswordError(Validation.isPasswordValid(value));
                break;
            case fields[2]:
                setPassword2(value);
                setPasswordError2(Validation.isPasswordValid(value));
                break;
        }
    }

    const onEditPressed = () => {
        if(passwordError || !oldPassword || !password) {
        
            console.log("wroooooong")
            console.log(oldPassword, password);
            
            return;
        }

        const jsonPayload = {
            oldPassword,
            password
        }

        update(jsonPayload as UserModel)
        setLoading(loading);

    }


    return (
        <View>
            <View style={styles.fieldContainer}>
                <View style={styles.row}>
                    <Text style={styles.label}>{labels[0]}</Text>
                    <TextInput
                        style={[styles.input, textColor]}
                        onChangeText={(value) => onChange(fields[0], value)}
                        secureTextEntry
                    />
                </View>
            </View>
            <View style={styles.fieldContainer}>
                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                <View style={styles.row}>
                    <Text style={styles.label}>{labels[1]}</Text>
                    <TextInput
                        style={[styles.input, textColor]}
                        onChangeText={(value) => onChange(fields[1], value)}
                        secureTextEntry
                    />
                </View>
            </View>
            <View style={styles.fieldContainer}>
                {passwordError2 && <Text style={styles.errorText}>{passwordError2}</Text>}
                <View style={styles.row}>
                    <Text style={styles.label}>{labels[2]}</Text>
                    <TextInput
                        style={[styles.input, textColor]}
                        onChangeText={(value) => onChange(fields[2], value)}
                        secureTextEntry
                    />
                </View>
            </View>
            <View style={styles.fieldContainer}>
                {<TouchableOpacity style={[styles.editButton, { alignSelf: 'flex-end' }]} onPress={onEditPressed}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    fieldContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 5,
        // backgroundColor: 'orange'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'green'
    },
    label: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 10,
        marginLeft: 10
    },
    editButton: {
        paddingHorizontal: 20,
        marginLeft: 10,
        backgroundColor: 'tomato',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginVertical: 5,
    },
});