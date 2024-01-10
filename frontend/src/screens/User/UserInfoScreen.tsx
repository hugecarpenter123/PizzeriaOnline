import React, { useState, useContext, useEffect, useMemo } from 'react';
import { SafeAreaView, Text, StyleSheet, View, ScrollView, StatusBar, RefreshControl } from 'react-native';
import { AppContext, UserDetails } from '../../contexts/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import EditField from '../../components/EditField';
import Validation from '../../utils/validation';
import AddressEditFields from '../../components/AddressEditFields';
import PasswordsEditFields from '../../components/PasswordsEditFields';
import UserProfilePicture from '../../components/UserProfilePicture';
import DateEditField from '../../components/DateEditField';
import UserInfoBottom from '../../components/UserInfoBottom';
import LoadingIndicator from '../../components/LoadingIndicator';
import useFetchUserDetails from '../../hooks/useFetchUserDetails';
import PersonalEditFields from '../../components/PersonalEditFields';

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
    console.log("UserInfoScreen render")
    const [loading, setLoading] = useState<boolean>(false);
    const { fetchUserDetails, loading: fetchUserDetailsLoading, error } = useFetchUserDetails();

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
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl
                    refreshing={loading || fetchUserDetailsLoading}
                    onRefresh={fetchUserDetails} />}
            >
                <UserProfilePicture imageSource={null} />
                <PersonalEditFields setLoading={setLoading} />
                <Separator />
                <AddressEditFields setLoading={setLoading} />
                <Separator />
                <PasswordsEditFields setLoading={setLoading} />
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