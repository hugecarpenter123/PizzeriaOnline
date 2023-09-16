import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, ScrollView, StatusBar } from 'react-native';
import { AppContext, UserDetails } from '../contexts/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import EditField from '../components/EditField';
import Validation from '../utils/validation';
import AddressEditFields from '../components/AddressEditFields';
import AccountEditFields from '../components/AccountEditFields';
import UserProfilePicture from '../components/UserProfilePicture';
import DateEditField from '../components/DateEditField';
import UserInfoBottom from '../components/UserInfoBottom';

type Fields = {
    [key: string]: string | null,
    name: string | null,
    surname: string | null,
    email: string | null,
    city: string | null,
    cityCode: string | null,
    street: string | null,
    houseNumber: string | null,
    phoneNumber: string | null,
    dateOfBirth: string | null,
}

export default function UserInfoScreen() {
    const { userDetails, setUserDetails } = useContext(AppContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [rerender, setRerender] = useState(false);

    const fieldKeys = ["name", "surname", "dateOfBirth", "phoneNumber", "email"]
    const fieldNames = ["Imię", "Nazwisko", "Data urodzenia", "Numer telefonu", "Email"];
    const validationMethods = [
        (value: string) => Validation.isNameValid(value),
        (value: string) => Validation.isSurnameValid(value),
        (value: string) => Validation.isDateOfBirthValid(value),
        (value: string) => Validation.isPhoneValid(value),
        (value: string) => Validation.isEmailValid(value),
    ]


    /**
     * Funciton renders Views that display current value with edit button to send post request and change the given piece of data
     * 
     * @returns 
     */
    const PersonalEditFields: React.FC = () => {
        if (userDetails) {
            return fieldKeys.map((fieldName, index) => {
                if (fieldName === 'dateOfBirth') {
                    return <DateEditField
                        key={index}
                        field={fieldName}
                        label={fieldNames[index]}
                        value={userDetails[fieldName]}
                        validation={validationMethods[index]}
                        setLoading={(loading) => setLoading(loading)} />
                }
                return <EditField
                    key={index}
                    field={fieldName}
                    label={fieldNames[index]}
                    value={userDetails[fieldName]}
                    validation={validationMethods[index]}
                    setLoading={(loading) => setLoading(loading)} />
            })
        } else {
            // TODO: handle situation when no userDetails available (there should never be such situation)
        }
    }

    const Separator: React.FC = () => {
        return <View style={
            {
                width: '100%',
                height: 1,
                backgroundColor: 'grey',
                marginVertical: 5,
            }} />
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <UserProfilePicture imageSource={null} />
                <PersonalEditFields />
                <Separator />
                <AddressEditFields setLoading={(loading) => setLoading(loading)} />
                <Separator />
                <AccountEditFields setLoading={(loading) => setLoading(loading)} />
                <Separator />
                <UserInfoBottom />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
})