import React from "react";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { TopTabParamList } from "./UserScreen";
import UserReviewsScreen from "./UserReviewsScreen";
import UserReviewDetailsScreen from "./UserReviewDetailsScreen";

type Props = NativeStackScreenProps<TopTabParamList, 'UserReviewsTabs'>;

export type UserReviewsStackParamList = {
    UserReviews: undefined,
    UserReviewDetails: {
        reviewId: number,
    },
}

const UserReviewsStack = createNativeStackNavigator<UserReviewsStackParamList>();


const UserReviewsTabs = () => {
    console.log("UserReviewsTabs render");
    return (
        <UserReviewsStack.Navigator>
            <UserReviewsStack.Screen
                name="UserReviews"
                component={UserReviewsScreen}
                options={{ headerShown: false }}
            />
            <UserReviewsStack.Screen
                name="UserReviewDetails"
                component={UserReviewDetailsScreen}
                options={{
                    headerTitle: "Edytuj opinię"
                }}
            />
        </UserReviewsStack.Navigator>
    );
}

export default UserReviewsTabs;