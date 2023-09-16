import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardTypeOptions } from 'react-native';
import Validation from '../utils/validation';
import { AppContext } from '../contexts/AppContext';

export type AddressProps = {
    [key: string]: string,
    ordererName: string,
    city: string,
    cityCode: string,
    street: string,
    houseNumber: string,
    phone: string,
}

type Errors = {
    [key: string]: string | null,
    ordererName: string,
    city: string | null,
    cityCode: string | null,
    street: string | null,
    houseNumber: string | null,
    phone: string | null,
}

type Props = {
    setAddressData: (data: AddressProps) => void;
}

const AddressForm = ({ setAddressData }: Props) => {
    const { userDetails } = useContext(AppContext);
    const fullName = userDetails?.name && userDetails?.surname ? `${userDetails?.name} ${userDetails?.surname}` : '';
    const [formData, setFormData] = useState<AddressProps>({
        ordererName: fullName,
        city: userDetails?.city || '',
        cityCode: userDetails?.cityCode || '',
        street: userDetails?.street || '',
        houseNumber: userDetails?.houseNumber || '',
        phone: userDetails?.phoneNumber || '',
    });

    const [formErrors, setFormErrors] = useState<Errors>({} as Errors);


    useEffect(() => {
        console.log("update Parent state")
        setAddressData(formData)
    }, [formData])


    const keyboardTypeMap: { [key: string]: KeyboardTypeOptions } = {
        'phone': 'phone-pad',
        'default': 'default',
        'digits': 'numeric',
    };

    const inputFields = [
        { name: "ordererName", label: "Pełne imię", keyboardTypeMap: 'default', validation: (input: string) => Validation.isFullNameValid(input) },
        { name: "city", label: "Miasto", keyboardTypeMap: 'default', validation: (input: string) => Validation.isNameValid(input) },
        { name: "cityCode", label: "Kod pocztowy", keyboardTypeMap: 'digits', validation: (input: string) => Validation.isCityCodeValid(input) },
        { name: "street", label: "Ulica", keyboardTypeMap: 'default', validation: (input: string) => Validation.isStreetValid(input) },
        { name: "houseNumber", label: "Numer domu", keyboardTypeMap: 'default', validation: (input: string) => Validation.isHouseNumberValid(input) },
        { name: "phone", label: "Numer telefonu", keyboardTypeMap: 'phone', validation: (input: string) => Validation.isPhoneValid(input) },
    ];


    const handleChange = (name: string, value: string) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        setFormErrors((prevFormData) => ({
            ...prevFormData,
            [name]: inputFields.filter((x) => x.name === name)[0].validation(value)
        }))
    };

    return (
        <View style={styles.fieldContainer}>
            {
                inputFields.map((input) => (
                    <View key={input.name}>
                        {formErrors[input.name] && <Text style={styles.errorText}>{formErrors[input.name]}</Text>}
                        <View style={styles.row}>
                            <Text style={styles.label}>{input.label}</Text>
                            <TextInput
                                value={formData[input.name]}
                                onChangeText={(value) => handleChange(input.name, value)}
                                style={styles.input}
                                keyboardType={keyboardTypeMap[input.keyboardTypeMap]}
                            />
                        </View>
                    </View>
                ))
            }
        </View>
    );
}


const styles = StyleSheet.create({
    fieldContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 5,
    },
    label: {
        flex: 2,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
        marginRight: 10,
    },
    input: {
        flex: 3,
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

export default AddressForm;