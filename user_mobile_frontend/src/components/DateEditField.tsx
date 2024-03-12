import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Platform, useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import useUpdateUser, { UserModel } from '../hooks/useUpdateUser';
import { commonStyles } from '../utils/StaticAppInfo';
import { useIsFocused } from '@react-navigation/native';

type EditFieldProps = {
    field: string,
    label: string,
    value: string,
    validation: (input: string) => string | null,
    setLoading: (loading: boolean) => void,
}

export default function DateEditField({ field, label, value, validation, setLoading }: EditFieldProps) {

    const [fieldValue, setFieldValue] = useState<string>(value)
    const [error, setError] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const {loading, update, error: updateError} = useUpdateUser();

    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? commonStyles.darkThemeText : commonStyles.lightThemeText;
    const isFocused = useIsFocused();

    // DATE PICKER RELATED --------------------------------------------------
    const toggleDatePicker = () => {
        console.log("set showDatePicker to: " + !showDatePicker);
        setShowDatePicker(!showDatePicker);
    }

    // whenever update is being called, trace its 'loading' state and callback its outcome to parent so that it can display
    //  it the the center
    useEffect(() => {
        setLoading(loading)
    }, [loading])

    useEffect(() => {
        if (updateError || !isFocused) {
            setFieldValue(value);
            setError(null);
        }
    })

    const onChangeDatePicker = ({ type }: any, selectedDate: any) => {
        // todo: handle scenario for IOS
        if (type == 'set') {
            if (Platform.OS === 'android') {
                toggleDatePicker();
                setFieldValue(formatDate(selectedDate.toDateString()));
            }
        } else {
            toggleDatePicker();
        }
    }

    const formatDate = (rawDate: string): string => {
        const date = new Date(rawDate);
        const year = date.getFullYear();
        let month: number | string = date.getMonth() + 1;
        let day: number | string = date.getDay();

        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        return `${day}-${month}-${year}`;
    }

    const minDate = (): Date => {
        const currentDate = new Date();
        const minDate = new Date();
        minDate.setFullYear(currentDate.getFullYear() - 14);
        return minDate;
    }

    // END DATE PICKER RELATED ----------------------

    const onEditClicked = () => {
        update({dateOfBirth: fieldValue} as UserModel)
    }


    return (
        <View style={styles.fieldContainer}>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Pressable style={styles.inputWrapper} onPress={toggleDatePicker}>
                    <TextInput
                        style={[
                            styles.input,
                            error ? { borderColor: "red" } : null,
                            textColor,
                        ]}
                        placeholder="Date of Birth"
                        onChangeText={(value) => setError(validation(value))}
                        value={fieldValue}
                        editable={false}
                    />
                </Pressable>

                {showDatePicker && <DateTimePicker
                    mode="date"
                    display="spinner"
                    value={new Date()}
                    onChange={onChangeDatePicker}
                    maximumDate={minDate()}
                />}
                {<TouchableOpacity style={styles.editButton} onPress={onEditClicked}>
                    <Text style={styles.editButtonText}>Edytuj</Text>
                </TouchableOpacity>}
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
        alignItems: 'center',
        // backgroundColor:'brown',
    },
    label: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        // backgroundColor: "yellow"
    },
    inputWrapper: {
        flex: 1,
        marginLeft: -10
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        padding: 10,
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