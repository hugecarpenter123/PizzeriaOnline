import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LoadingIndicator from '../../components/LoadingIndicator';
import { PizzaScreenParamList } from './PizzaScreen';
import useCreateReview from '../../hooks/useCreateReview';

type Props = NativeStackScreenProps<PizzaScreenParamList, 'CreateReview'>;

const CreateReviewScreen = ({ route, navigation }: Props) => {
    console.log("CreateReviewScreen render")
    const { pizza } = route.params;
    const [stars, setStars] = useState<number>(0);
    const [content, setContent] = useState<string>("");
    const { loading, success, addReview } = useCreateReview();

    // TODO: make it reusable component
    const handleStarChange = (clickedStar: number) => {
        if (stars < clickedStar || stars > clickedStar) {
            setStars(clickedStar)
        } else if (stars === clickedStar) {
            // gwiazdka jest pełna
            if (stars % 1 == 0) {
                setStars(clickedStar - 0.5);
            }
            // gwiazdka pół pełna
            else {
                setStars(Math.ceil(clickedStar))
            }
        }
    }

    useEffect(() => {
        if (success) {
            navigation.goBack();
        }
    }, [success])

    const renderStars = () => {
        const fullStars = Math.floor(stars);
        const halfStar = stars % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

        return (
            <View style={styles.starContainer}>
                {[...Array(fullStars)].map((_, index) => (
                    <TouchableOpacity
                        key={index + 1}
                        onPress={() => handleStarChange(index + 1)}>
                        <FontAwesome name="star" size={28} color="gold" key={`full-${index}`} />

                    </TouchableOpacity>
                ))}
                {halfStar &&
                    <TouchableOpacity
                        key={fullStars + 1}
                        onPress={() => handleStarChange(fullStars + 0.5)}>
                        <FontAwesome name="star-half-full" size={28} color="gold" />
                    </TouchableOpacity>
                }
                {[...Array(emptyStars)].map((_, index) => (
                    <TouchableOpacity
                        key={fullStars + (halfStar ? 1 : 0) + index + 1}
                        onPress={() => handleStarChange(fullStars + (halfStar ? 0.5 : 0) + index + 1)}>
                        <FontAwesome name="star-o" size={28} color="gold" />
                    </TouchableOpacity>
                ))}
            </View>
        );
    }

    const onSavePressed = () => {
        // no changes
        if (!stars && !content) {
            navigation.goBack();
            return;
        }
        // else there are changes
        // TODO: make request to replace the comment
        else {
            const data = {
                pizzaId: pizza.id,
                stars,
                content,
            }

            // TODO: make request to create new review
            addReview(data);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.reviewContainer}>
                <View style={styles.header}>
                    <Image
                        style={styles.image}
                        source={{ uri: pizza.imageUrl }}
                    />
                    <View style={styles.center}>
                        <View style={styles.headerTop}>
                            <Text style={styles.pizzaName}>{pizza.name}</Text>
                        </View>
                        <View style={styles.starContainer}>
                            {renderStars()}
                        </View>
                    </View>
                </View>
                <TextInput
                    style={styles.textInput}
                    placeholder='Napisz swoją opinię tutaj...'
                    multiline={true}
                    numberOfLines={7}
                    textAlignVertical="top"
                    scrollEnabled={true}
                    onChangeText={setContent}
                />

                <TouchableOpacity style={styles.button} onPress={onSavePressed}>
                    <Text style={styles.buttonText}>Dodaj opinię</Text>
                </TouchableOpacity>
            </View>
            {loading && <LoadingIndicator />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    reviewContainer: {
        backgroundColor: '#f0f0f0',
        // backgroundColor: 'purple',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    pizzaName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    starContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    starIcon: {
        marginRight: 5,
    },
    createdAt: {
        color: '#888',
    },
    textInput: {
        marginVertical: 10,
        fontSize: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    image: {
        width: 65,
        height: 65,
        borderRadius: 50,
        resizeMode: 'stretch',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    center: {
        height: '100%',
        flex: 1,
        gap: 5
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        alignSelf: 'center',
        backgroundColor: 'tomato',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        width: '50%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateReviewScreen;