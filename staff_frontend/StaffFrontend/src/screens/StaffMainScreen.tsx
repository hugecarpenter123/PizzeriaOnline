import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./AppStacks";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

type Props = NativeStackScreenProps<RootStackParamList, 'StaffMainScreen'>;
const StaffMainScreen = ({ route, navigation }: Props) => {

    const [newOrderNotificationCount, setNewOrderNotificationCount] = useState<number>(0);
    const [updateRequestCount, setUpdateRequestCount] = useState<number>(0);

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.notificationsContainer}>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'aqua',
    },
    notificationsContainer: {
        
    }
});

export default StaffMainScreen;