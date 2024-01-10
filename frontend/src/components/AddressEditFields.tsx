import React, { useState, useEffect, useContext, useRef } from 'react'
import { AppContext, UserDetails } from '../contexts/AppContext'
import { View, StyleSheet, Text, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import Validation from '../utils/validation';
import useUpdateUser, { UserModel } from '../hooks/useUpdateUser';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { commonStyles } from '../utils/StaticAppInfo';

type Props = {
    setLoading: (loading: boolean) => void,
}


export default function AddressEditFields({ setLoading }: Props) {
    // console.log("AddressEditFields render")
    const colorScheme = useColorScheme();
    const textColor = colorScheme === 'dark' ? commonStyles.darkThemeText : commonStyles.lightThemeText;

    const { loading, update, error } = useUpdateUser();

    const { userDetails } = useContext(AppContext);
    const [city, setCity] = useState<string | undefined>(userDetails?.city)
    const [cityCode, setCityCode] = useState<string | undefined>(userDetails?.cityCode)
    const [street, setStreet] = useState<string | undefined>(userDetails?.street)
    const [houseNumber, setHouseNumber] = useState<string | undefined>(userDetails?.houseNumber)

    const [cityError, setCityError] = useState<string | null>(null)
    const [cityCodeError, setCityCodeError] = useState<string | null>(null)
    const [streetError, setStreetError] = useState<string | null>(null)
    const [houseNumberError, setHouseNumberError] = useState<string | null>(null)
    const isFocused = useIsFocused();

    const fields = [
        "city",
        "cityCode",
        "street",
        "houseNumber",
    ]

    const labels = [
        "Miasto",
        "Kod Pocztowy",
        "Ulica",
        "Numer domu",
    ]

    useEffect(() => {
        setLoading(loading)
    }, [loading])

    // if api call is not succesfull, then update the fields back to previous state
    useEffect(() => {
        if (error || !isFocused) {
            resetInputs();
        }
    }, [error, isFocused])


    const resetInputs = () => {
        setCity(userDetails?.city);
        setCityCode(userDetails?.cityCode);
        setStreet(userDetails?.street);
        setHouseNumberError(null);
        setCityError(null);
        setCityCodeError(null);
        setStreetError(null);
        setHouseNumberError(null);
    }

    const onChange = (field: string, value: string) => {
        switch (field) {
            case "city":
                setCity(value);
                setCityError(Validation.isCityValid(value));
                break;
            case "cityCode":
                setCityCode(value);
                setCityCodeError(Validation.isCityCodeValid(value));
                break;
            case "street":
                setStreet(value);
                setStreetError(Validation.isStreetValid(value));
                break;
            case "houseNumber":
                setHouseNumber(value);
                setHouseNumberError(Validation.isHouseNumberValid(value));
                break;
        }
    }


    const onEditPressed = () => {
        update({
            city,
            cityCode,
            street,
            houseNumber,
        } as UserModel)
    }

    return (
        <View>
            <View style={styles.fieldContainer}>
                {cityError && <Text style={styles.errorText}>{cityError}</Text>}
                <View style={styles.row}>
                    <Text style={styles.label}>{labels[0]}</Text>
                    <TextInput
                        style={[styles.input, textColor]}
                        value={city}
                        onChangeText={(value) => onChange(fields[0], value)}
                    />
                </View>
            </View>
            <View style={styles.fieldContainer}>
                {cityCodeError && <Text style={styles.errorText}>{cityCodeError}</Text>}
                <View style={styles.row}>
                    <Text style={styles.label}>{labels[1]}</Text>
                    <TextInput
                        style={[styles.input, textColor]}
                        value={cityCode}
                        onChangeText={(value) => onChange(fields[1], value)}
                    />
                </View>
            </View>
            <View style={styles.fieldContainer}>
                {streetError && <Text style={styles.errorText}>{streetError}</Text>}
                <View style={styles.row}>
                    <Text style={styles.label}>{labels[2]}</Text>
                    <TextInput
                        style={[styles.input, textColor]}
                        value={street}
                        onChangeText={(value) => onChange(fields[2], value)}
                    />
                </View>
            </View>
            <View style={styles.fieldContainer}>
                {houseNumberError && <Text style={styles.errorText}>{houseNumberError}</Text>}
                <View style={styles.row}>
                    <Text style={styles.label}>{labels[3]}</Text>
                    <TextInput
                        style={[styles.input, textColor]}
                        value={houseNumber}
                        onChangeText={(value) => onChange(fields[3], value)}
                    />
                </View>
            </View>
            <View style={styles.fieldContainer}>
                <TouchableOpacity style={[styles.editButton, { alignSelf: 'flex-end' }]} onPress={onEditPressed}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
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