import React, { useContext } from 'react';
import { SafeAreaView, FlatList, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AppContext, UserReview } from '../../contexts/AppContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserReviewsStackParamList } from './UserReviewsTabs';


type Props = NativeStackScreenProps<UserReviewsStackParamList, 'UserReviews'>;

export default function UserReviewsScreen({ route, navigation }: Props) {
    console.log("UserReviewsScreen render")
    const { userDetails } = useContext(AppContext);
    const reviews = userDetails?.reviews;

    // Function to render each review item
    const renderReviewItem = ({ item }: { item: UserReview }) => {

        const { pizzaName, stars, content, createdAt } = item;
        const formattedDate = new Date(createdAt).toLocaleString();

        const onPress = () => {
            navigation.navigate("UserReviewDetails", {reviewId: item.id})
        }

        // Function to render star icons
        const renderStars = (numStars: number) => {
            const fullStars = Math.floor(numStars);
            const halfStar = numStars % 1 !== 0;

            return (
                <View style={styles.starContainer}>
                    {[...Array(fullStars)].map((_, index) => (
                        <FontAwesome name="star" size={20} color="gold" key={index} />
                    ))}
                    {halfStar && <FontAwesome name="star-half" size={20} color="gold" />}
                </View>
            );
        };

        return (
            <TouchableOpacity onPress={onPress}>
                <View style={styles.reviewContainer}>
                    <View style={styles.header}>
                        <Image style={styles.image} source={{ uri: item.imageUrl }} />
                        <View style={styles.center}>
                            <Text style={styles.pizzaName}>{pizzaName}</Text>
                            {renderStars(stars)}
                        </View>
                        <View style={styles.right}>
                            <Text style={styles.createdAt}>{formattedDate}</Text>
                        </View>
                    </View>
                    <Text style={styles.content}>{content}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={reviews}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderReviewItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    reviewContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    pizzaName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    starContainer: {
        flexDirection: 'row',
    },
    starIcon: {
        marginRight: 5,
    },
    createdAt: {
        color: '#888',
    },
    content: {
        fontSize: 16,
    },
    image: {
        width: 65,
        height: 65,
        borderRadius: 50,
        resizeMode: 'stretch',
    },
    header: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        gap: 10,
    },
    center: {
        height: '100%'
    },
    right: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        justifyContent: 'flex-end'
    },
});