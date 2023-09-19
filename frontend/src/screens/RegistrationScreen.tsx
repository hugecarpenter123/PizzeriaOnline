import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Pressable, Platform, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./AppStacks";
import Validation from "../utils/validation";
import showToast from "../utils/showToast";
import useRegistration from "../hooks/useRegistration";
import DateTimePicker from '@react-native-community/datetimepicker';
import LoadingIndicator from "../components/LoadingIndicator";
import { Entypo } from '@expo/vector-icons';

export type RegistrationData = {
    name: string,
    surname: string,
    email: string,
    password: string,
    city: string,
    cityCode: string,
    street: string,
    houseNumber: string,
    phoneNumber: string,
    dateOfBirth: string,
}

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrationScreen'>;
export default function RegistrationScreen({ route, navigation }: Props) {

    const { loading, error, success, register } = useRegistration();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        password2: '',
        city: '',
        cityCode: '',
        street: '',
        houseNumber: '',
        phoneNumber: '',
        dateOfBirth: '',
    });

    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        let arePwdsSame = formData.password === formData.password2;
        let pwdMatchError = arePwdsSame ? null : "Hasła muszą być takie same";
        // wyświetl error tylko jeżeli hasła się nie zgadzają && pwd2 jest wypełnione && nie istnieje inny error
        if (pwdMatchError && formData.password2 && !password2Error) {
            setPassword2Error(pwdMatchError);
        }
    }, [formData.password, formData.password2]);

    const [nameError, setNameError] = useState<string | null>(null);
    const [surnameError, setSurnameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [password2Error, setPassword2Error] = useState<string | null>(null);
    const [cityError, setCityError] = useState<string | null>(null);
    const [cityCodeError, setCityCodeError] = useState<string | null>(null);
    const [streetError, setStreetError] = useState<string | null>(null);
    const [houseNumberError, setHouseNumberError] = useState<string | null>(null);
    const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
    const [dateOfBirthError, setDateOfBirthError] = useState<string | null>(null);

    const areValidationErrors = (): boolean => {
        // to avoid asynchronous nature of useState, grab values from validation synchronously
        const _nameError = Validation.isNameValid(formData.name)
        const _surnameError = Validation.isSurnameValid(formData.surname)
        const _emailError = Validation.isEmailValid(formData.email)
        const _passwordError = Validation.isPasswordValid(formData.password)
        const _password2Error = Validation.isPasswordValid(formData.password2)
        const _cityError = Validation.isCityValid(formData.city)
        const _cityCodeError = Validation.isCityCodeValid(formData.cityCode)
        const _streetError = Validation.isStreetValid(formData.street)
        const _houseNumberError = Validation.isHouseNumberValid(formData.houseNumber)
        const _phoneError = Validation.isPhoneValid(formData.phoneNumber)
        const _dateOfBirthError = Validation.isDateOfBirthValid(formData.dateOfBirth);

        // then set asynchronously State of validation props
        setNameError(_nameError);
        setSurnameError(_surnameError);
        setEmailError(_emailError);
        setPasswordError(_passwordError);
        setPassword2Error(_password2Error);
        setCityError(_cityError);
        setCityCodeError(_cityCodeError);
        setStreetError(_streetError);
        setHouseNumberError(_houseNumberError);
        setPhoneNumberError(_phoneError);
        setDateOfBirthError(_dateOfBirthError)

        // return synchronously boolean
        return Array.of(nameError,
            _surnameError,
            _emailError,
            _passwordError,
            _password2Error,
            _cityError,
            _cityCodeError,
            _streetError,
            _houseNumberError,
            _phoneError,
            _dateOfBirthError).some(error => error);
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });

        switch (field) {
            case "name":
                setNameError(Validation.isNameValid(value));
                break;
            case "surname":
                setSurnameError(Validation.isSurnameValid(value));
                break;
            case "email":
                setEmailError(Validation.isEmailValid(value));
                break;
            case "password":
                setPasswordError(Validation.isPasswordValid(value));
                break;
            case "password2":
                setPassword2Error(Validation.isPasswordValid(value));
                break;
            case "city":
                setCityError(Validation.isCityValid(value));
                break;
            case "cityCode":
                setCityCodeError(Validation.isCityCodeValid(value));
                break;
            case "street":
                setStreetError(Validation.isStreetValid(value));
                break;
            case "houseNumber":
                setHouseNumberError(Validation.isHouseNumberValid(value));
                break;
            case "phoneNumber":
                setPhoneNumberError(Validation.isPhoneValid(value));
                break;
            case "dateOfBirth":
                setDateOfBirthError(Validation.isDateOfBirthValid(value))
                break;
        }
    };

    const handleRegistration = (): void => {
        if (areValidationErrors()) {
            showToast("Niektóra pola nie są wypełnione poprawnie", 0);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
            return;
        } else {
            register(formData)
        }
    }

    // DATE PICKER RELATED --------------------------------------------------
    const toggleDatePicker = () => {
        console.log("set showDatePicker to: " + !showDatePicker);
        setShowDatePicker(!showDatePicker);
    }

    const onChangeDatePicker = ({ type }: any, selectedDate: any) => {
        // todo: handle scenario for IOS
        if (type == 'set') {
            if (Platform.OS === 'android') {
                toggleDatePicker();
                handleInputChange("dateOfBirth", formatDate(selectedDate.toDateString()));
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
    // END DATE PICKER RELATED -----------------------------------------------


    // NAVIGATION RELATED --------------------------------------------------
    const onLoginSwtichPressed = (): void => {
        navigation.replace('LoginScreen')
    }

    const onContinueUnloggedPressed = (): void => {
        navigation.replace("MainScreen");
    }
    // END NAVIGATION RELATED ----------------------------------------------


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                ref={scrollViewRef}
            >
                {/* <Text style={styles.title}>Registration</Text>
                <Image style={styles.topImage} source={require('../../assets/images/pizzeria-registration.jpg')}/> */}

                {nameError && <Text style={styles.errorText}>{nameError}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        nameError ? { borderColor: "red" } : null,
                    ]}
                    placeholder="Name"
                    onChangeText={(value) => handleInputChange("name", value)}
                />
                {surnameError && <Text style={styles.errorText}>{surnameError}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        surnameError ? { borderColor: "red" } : null,
                    ]}
                    placeholder="Surname"
                    onChangeText={(value) => handleInputChange('surname', value)}
                />
                {emailError && <Text style={styles.errorText}>{emailError}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        emailError ? { borderColor: "red" } : null,
                    ]}
                    placeholder="Email"
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                />
                {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        passwordError ? { borderColor: "red" } : null,
                    ]}
                    placeholder="Password"
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry
                />
                {password2Error && <Text style={styles.errorText}>{password2Error}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        password2Error ? { borderColor: "red" } : null,
                    ]}
                    placeholder="Repeat password"
                    onChangeText={(value) => handleInputChange('password2', value)}
                    secureTextEntry
                />
                {cityError && <Text style={styles.errorText}>{cityError}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        cityError ? { borderColor: "red" } : null,
                    ]}
                    placeholder="City"
                    onChangeText={(value) => handleInputChange('city', value)}
                />
                {cityCodeError && <Text style={styles.errorText}>{cityCodeError}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        cityCodeError ? { borderColor: "red" } : null,
                    ]}
                    placeholder="City Code"
                    keyboardType="decimal-pad"
                    onChangeText={(value) => handleInputChange('cityCode', value)}
                />
                {streetError && <Text style={styles.errorText}>{streetError}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        streetError ? { borderColor: "red" } : null,
                    ]}
                    placeholder="Street"
                    onChangeText={(value) => handleInputChange('street', value)}
                />
                {houseNumberError && <Text style={styles.errorText}>{houseNumberError}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        houseNumberError ? { borderColor: "red" } : null,
                    ]}
                    placeholder="House Number"
                    onChangeText={(value) => handleInputChange('houseNumber', value)}
                />
                {phoneNumberError && <Text style={styles.errorText}>{phoneNumberError}</Text>}
                <TextInput
                    style={[
                        styles.input,
                        phoneNumberError ? { borderColor: "red" } : null,
                    ]}
                    placeholder="Phone Number"
                    onChangeText={(value) => handleInputChange('phoneNumber', value)}
                    keyboardType="phone-pad"
                />
                {dateOfBirthError && <Text style={styles.errorText}>{dateOfBirthError}</Text>}

                <Pressable style={{ width: '100%' }} onPress={toggleDatePicker}>
                    <TextInput
                        style={[
                            styles.input,
                            dateOfBirthError ? { borderColor: "red" } : null,
                        ]}
                        placeholder="Date of Birth"
                        onChangeText={(value) => handleInputChange('dateOfBirth', value)}
                        value={formData.dateOfBirth}
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

                <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                    <Text style={styles.buttonText}>Zarejestruj</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.coonitueButton} onPress={onContinueUnloggedPressed}>
                    <Text style={styles.buttonText}>Koontynuuję bez rejestracji</Text>
                    <Entypo name="arrow-bold-right" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginButton} onPress={onLoginSwtichPressed}>
                    <Text style={styles.buttonText}>Mam już konto</Text>
                </TouchableOpacity>

            </ScrollView>
            {loading && <LoadingIndicator />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContainer: {
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 50, // Add some padding to the bottom to avoid cutting off content
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: 'white'
    },
    button: {
        width: '100%',
        backgroundColor: 'tomato',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20, // Add some margin between the button and other elements
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 15,
    },
    linkText: {
        color: 'blue'
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: 5,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        alignItems: 'center',
        justifyContent: 'center'
    },
    coonitueButton: {
        marginTop: 10,
        backgroundColor: 'lightblue',
        width: '100%',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    topImage: {
        width: '100%',
        height: 150,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    loginButton: {
        marginTop: 10,
        backgroundColor: 'lightgreen',
        width: '60%',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    }
});