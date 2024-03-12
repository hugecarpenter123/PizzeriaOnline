import React, {} from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Review } from '../contexts/MainScreenContext';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
    item: Review,
}

// co potrzeba:
// item w propsach musi zwracać: id, userImageUrl, stars, content, createdAt 

function RenderPizzaReviewItem({ item }: Props) {

    const { userFullName, userImageUrl, stars, content, createdAt } = item;
    const formattedDate = new Date(createdAt).toLocaleString();

    const renderStars = () => {
        const fullStars = Math.floor(stars);
        const halfStar = stars % 1 !== 0;

        return (
            <View style={styles.starContainer}>
                {[...Array(fullStars)].map((_, index) => (
                    <FontAwesome name="star" size={18} color="gold" key={index} />
                ))}
                {halfStar && <FontAwesome name="star-half" size={18} color="gold" />}
            </View>
        );
    };

    return (
        <View style={styles.reviewContainer}>
            <View style={styles.header}>
                <Image
                    style={styles.image}
                    source={userImageUrl ? { uri: userImageUrl } : require('../../assets/images/no-user.png')} />
                <View style={styles.center}>
                    <View style={styles.headerTop}>
                        <Text style={styles.userName}>{userFullName}</Text>
                        <Text style={styles.createdAt}>{formattedDate}</Text>
                    </View>
                    <View style={styles.starContainer}>
                        {renderStars()}
                    </View>
                </View>
            </View>
            <Text style={styles.content}>{content}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    reviewContainer: {
        width: '100%',
        backgroundColor: '#f0f0f0',
        // backgroundColor: 'red',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        gap: 10
    },
    userName: {
        fontSize: 16,
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
        fontSize: 13,
    },
    content: {

    },
    image: {
        width: 50,
        height: 50,
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

export default RenderPizzaReviewItem;