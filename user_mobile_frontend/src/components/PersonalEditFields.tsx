import React, { useContext, useMemo } from "react";
import Validation from "../utils/validation";
import DateEditField from "./DateEditField";
import EditField from "./EditField";
import { AppContext } from "../contexts/AppContext";
import { useIsFocused } from "@react-navigation/native";

type Props = {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

type PersonalEditFieldsState = {
    name: string;
    surname: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
}

type PersonalEditFieldsErrorState = {
    name: string;
    surname: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
}

const PersonalEditFields: React.FC<Props> = ({ setLoading }) => {
    const { userDetails } = useContext(AppContext);
    const fieldKeys = useMemo(() => ["name", "surname", "dateOfBirth", "phoneNumber", "email"], []);
    const fieldNames = useMemo(() => ["Imię", "Nazwisko", "Data urodzenia", "Numer telefonu", "Email"], []);
    const validationMethods = useMemo(() => [
        (value: string) => Validation.isNameValid(value),
        (value: string) => Validation.isSurnameValid(value),
        (value: string) => Validation.isDateOfBirthValid(value),
        (value: string) => Validation.isPhoneValid(value),
        (value: string) => Validation.isEmailValid(value),
    ], []);


    return (
        <>
            {
                userDetails &&
                fieldKeys.map((fieldName, index) => {
                    if (fieldName === 'dateOfBirth') {
                        return <DateEditField
                            key={index}
                            field={fieldName}
                            label={fieldNames[index]}
                            value={userDetails[fieldName]}
                            validation={validationMethods[index]}
                            setLoading={setLoading} />
                    }
                    return <EditField
                        key={index}
                        field={fieldName}
                        label={fieldNames[index]}
                        value={userDetails[fieldName]}
                        validation={validationMethods[index]}
                        setLoading={setLoading} />
                })
            }
        </>
    )
}

export default PersonalEditFields;