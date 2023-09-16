import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardTypeOptions } from 'react-native';
import Validation from '../utils/validation';

export type ContactProps = {
    [key: string]: string,
    ordererName: string,
    phone: string,
}

type Errors = {
    [key: string]: string | null,
    ordererName: string | null,
    phone: string | null,
}

type Props = {
    setContactData: (data: ContactProps) => void;
}

const ContactForm = ({ setContactData }: Props) => {
    const [formData, setFormData] = useState<ContactProps>({
        ordererName: '',
        phone: ''
    });
    const [formErrors, setFormErrors] = useState<Errors>({} as Errors);

    useEffect(() => {
        setContactData(formData);
    }, [formData]);

    const keyboardTypeMap: { [key: string]: KeyboardTypeOptions } = {
        'phone': 'phone-pad',
        'default': 'default',
    };

    const inputFields = [
        { name: "ordererName", label: "Pełne imię", keyboardType: 'default', validation: (input: string) => Validation.isFullNameValid(input) },
        { name: "phone", label: "Numer telefonu", keyboardType: 'phone', validation: (input: string) => Validation.isPhoneValid(input) },
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
                                keyboardType={keyboardTypeMap[input.keyboardType]}
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

export default ContactForm;