import React, { useState, useContext, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { RadioButton, TouchableRipple } from 'react-native-paper';
import AddressForm, { AddressProps } from '../../components/AddressForm';
import CartCompletionItems from '../../components/CartCompletionItems';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CartParamList } from './CartStack';
import { MainScreenContext, orderedDrink, orderedPizza } from '../../contexts/MainScreenContext';
import { AppContext } from '../../contexts/AppContext';
import ContactForm, { ContactProps } from '../../components/ContactForm';
import useCreateOrder from '../../hooks/useCreateOrder';
import LoadingIndicator from '../../components/LoadingIndicator';
import useExchangeTokens from '../../hooks/useExchangeTokens';

export enum OrderType {
    DELIVERY,
    PICKUP
}

enum AddressOption {
    DEFAULT,
    CUSTOM
}

export type OrderPayloadModel = {
    // fields neccessary for unlogged users but optional (apart from orderer) for logged ones
    ordererName?: string;
    phone?: string;
    deliveryAddress?: string;

    // those will be attached as 'cart' object from context
    orderedPizzas: orderedPizza[];
    orderedDrinks: orderedDrink[];

    orderType: OrderType;
}

type Props = NativeStackScreenProps<CartParamList, 'OrderCompletion'>

const OrderCompletionScreen = ({ route, navigation }: Props) => {
    const { loading, success, addOrder } = useCreateOrder();
    const { token, userDetails } = useContext(AppContext);
    const { cart } = useContext(MainScreenContext);
    const [addressData, setAddressData] = useState<AddressProps>({} as AddressProps)
    const [contactData, setContactData] = useState<ContactProps>({} as ContactProps)
    const { exchangeTokens, loading: tokenLoading } = useExchangeTokens();

    const addressOptions = [
        { label: "Adres i dane kontaktowe konta", value: AddressOption.DEFAULT },
        { label: "Inne", value: AddressOption.CUSTOM },
    ]

    const deliveryOptions = [
        { label: "Dostawa", value: OrderType.DELIVERY },
        { label: "Odbiór osobisty", value: OrderType.PICKUP },
    ]

    const defaultAddresRadioProp = token ? AddressOption.DEFAULT : AddressOption.CUSTOM;
    const [addressOptionChecked, setAddressOptionChecked] = useState<AddressOption>(defaultAddresRadioProp);
    const [deliveryOptionChecked, setDeliveryOptionChecked] = useState<OrderType>(deliveryOptions[0].value);
    const Separator: React.FC = () => {
        return (
            <View style={{ width: '100%', height: 1, backgroundColor: 'grey', marginVertical: 5 }} />
        )
    }

    useEffect(() => {
        // whenever radio changes, clear customAddressData
        if (addressOptionChecked === AddressOption.DEFAULT) {
            setAddressData({} as AddressProps)
        }
    }, [addressOptionChecked])

    useEffect(() => {
        // whenever radio changes, clear customAddressData
        if (deliveryOptionChecked === OrderType.DELIVERY) {
            setContactData({} as ContactProps)
        } else {
            setAddressData({} as AddressProps)
        }
    }, [deliveryOptionChecked])

    useEffect(() => {
        if (success) {
            // in this component - on success navigation only goes back, but in the hook, userDetails is updated and cart is being cleaned
            navigation.goBack();
        }
    }, [success]);


    const AddressOptionsComponent: React.FC = () => {
        return addressOptions.map((addressOption) => (
            <View key={addressOption.value}>
                <TouchableRipple
                    onPress={() => setAddressOptionChecked(addressOption.value)}
                    // rippleColor="rgba(0, 0, 0, .32)"
                    style={[styles.radioButtonContainer, addressOptionChecked === addressOption.value ? styles.selectedOutline : null]}
                >
                    <>
                        <RadioButton.Android
                            value={addressOption.value.toString()}
                            status={addressOptionChecked === addressOption.value ? "checked" : "unchecked"}
                            onPress={() => setAddressOptionChecked(addressOption.value)}
                        />
                        <Text>{addressOption.label}</Text>
                    </>
                </TouchableRipple>
                {/* if "DEFAULT" raidoButton value is checked, then display account address and contact data */}
                {(addressOption.value === AddressOption.DEFAULT && addressOptionChecked === AddressOption.DEFAULT) &&
                    <View style={styles.defaultInfoContainer}>
                        <Text>Adres: <Text style={styles.defaultInfoText}>{userDetails?.street} {userDetails?.houseNumber}, {userDetails?.cityCode} {userDetails?.city}</Text></Text>
                        <Text>Telefon: <Text style={styles.defaultInfoText}>{userDetails?.phoneNumber}</Text></Text>
                    </View>
                }
            </View>

        ))
    }

    const DeliveryOptionsComponent: React.FC = () => {
        return deliveryOptions.map((deliveryOption) => (
            <TouchableRipple
                key={deliveryOption.value}
                onPress={() => setDeliveryOptionChecked(deliveryOption.value)}
                // rippleColor="rgba(0, 0, 0, .32)"
                style={[styles.radioButtonContainer, deliveryOptionChecked === deliveryOption.value ? styles.selectedOutline : null]}
            >
                <>
                    <RadioButton.Android
                        value={deliveryOption.value.toString()}
                        status={deliveryOptionChecked === deliveryOption.value ? "checked" : "unchecked"}
                        onPress={() => setDeliveryOptionChecked(deliveryOption.value)}
                    />
                    <Text>{deliveryOption.label}</Text>
                </>
            </TouchableRipple>
        ))
    }

    const onOrderPressed = () => {
        //TODO: 0. Collect data, 1. send post request to book an order, 2. clean the cart, 3. update userDetails, 4. display orders in ordersScreen
        const payload: OrderPayloadModel = {
            orderedPizzas: cart.orderedPizzaList,
            orderedDrinks: cart.orderedDrinkList,
            ...contactData,
            ...addressData,
            orderType: deliveryOptionChecked,
        }
        addOrder(payload);
    }

    const onRefreshTokenPressed = () => {
        exchangeTokens();
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Display cart content with corresponding info */}
                <View style={styles.orderItemsContainer}>
                    <CartCompletionItems sum={route.params.sum} />
                    <Separator />
                </View>

                {/* Display delivery options RadioButtons  */}
                <View style={styles.contentContainer}>
                    <Text style={styles.header}>Sposób odbioru</Text>
                    <DeliveryOptionsComponent />
                    <Separator />
                </View>

                {/* If delivery.option == "DELIVERY", display address-options-RadioButtons container */}
                {deliveryOptionChecked === OrderType.DELIVERY
                    ?
                    <View style={styles.contentContainer}>
                        <Text style={styles.header}>Adres dostawy oraz dane kontaktowe</Text>
                        {/* If user is not logged in don't display radios, because he needs to enter address */}
                        {token && <AddressOptionsComponent />}
                        {
                            /* If CUSTOM delivery address is set or user is not logged in, display DeliveryAddressForm */
                            (addressOptionChecked === AddressOption.CUSTOM || !token) &&
                            <AddressForm setAddressData={setAddressData} />
                        }
                    </View>
                    :
                    !token &&
                    <View style={styles.contentContainer}>
                        <Text style={styles.header}>Dane kontaktowe</Text>
                        <ContactForm setContactData={setContactData} />
                    </View>
                }

                <View style={styles.contentContainer}>
                    <TouchableOpacity style={styles.orderButton} onPress={onOrderPressed}>
                        <Text style={styles.buttonText}>Zamawiam</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.contentContainer} onPress={onRefreshTokenPressed}>
                    <Text>Refresh the token</Text>
                </TouchableOpacity>
            </ScrollView>
            {loading && <LoadingIndicator />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'purple',
        padding: 20,
        paddingBottom: 0,
    },
    scroll: {
        // backgroundColor: 'red'
        // padding: 20,
    },
    orderItemsContainer: {
        // height: 100,
        // backgroundColor: 'green',
    },
    contentContainer: {
        marginVertical: 10,
        // backgroundColor: 'gray',
    },
    radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
        paddingHorizontal: 5,
    },
    selectedOutline: {
        // borderBottomWidth: 1,
        // borderColor: 'tomato',
        // borderRadius: 15,
    },
    header: {
        fontSize: 20,
        marginBottom: 15,
    },
    orderButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'green',
        alignItems: 'center',
        borderRadius: 8,
        flex: 0,
        alignSelf: 'center',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    defaultInfoContainer: {
        marginHorizontal: 40,
        marginBottom: 10,

    },
    defaultInfoText: {
        fontWeight: 'bold',
        color: 'tomato'
    }
})

export default OrderCompletionScreen;