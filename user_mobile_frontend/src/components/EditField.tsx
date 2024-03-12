import React, { memo, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import useUpdateUser, { UserModel } from '../hooks/useUpdateUser';
import { commonStyles } from '../utils/StaticAppInfo';
import { useIsFocused } from '@react-navigation/native';
import { isConstructorTypeNode } from 'typescript';

type EditFieldProps = {
    field: string,
    label: string,
    value: string,
    validation: (input: string) => string | null,
    setLoading: (loading: boolean) => void,
}

const EditField = ({ field, label, value, validation, setLoading }: EditFieldProps) => {
    const [fieldValue, setFieldValue] = useState<string>(value)
    const [error, setError] = useState<string | null>(null);
    const { update, loading, error: updateError } = useUpdateUser();
    const isFocused = useIsFocused();

    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? commonStyles.darkThemeText : commonStyles.lightThemeText;

    useEffect(() => {
        setError(validation(fieldValue))
    }, [fieldValue])

    const handleEdit = () => {
        // for userDetails puprposes send request
        update({ [field]: fieldValue } as UserModel);
    }

    useEffect(() => {
        console.log("------------------loading from EditField on " + field)
        setLoading(loading);
    }, [loading])

    useEffect(() => {
        if (updateError || !isFocused) {
            setFieldValue(value);
            setError(null);
        }
    }, [updateError, isFocused])

    return (
        <View style={styles.fieldContainer}>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                    style={[styles.input, textColor]}
                    value={fieldValue}
                    onChangeText={setFieldValue}
                />
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Text style={styles.editButtonText}>Edytuj</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    fieldContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
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
        marginLeft: 10,
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

export default memo(EditField);