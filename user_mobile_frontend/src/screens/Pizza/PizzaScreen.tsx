import React, {  } from "react";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../AppStacks";
import PizzaList from "./PizzaList";
import PizzaDetailScreen from "./PizzaDetailScreen";
import CreateReviewScreen from "./CreateReviewScreen";
import { Pizza } from "../../contexts/MainScreenContext";
import { TabParamList } from "../MainScreenTabsInner";

type Props = NativeStackScreenProps<TabParamList & RootStackParamList, 'PizzaScreen'>;

export type PizzaScreenParamList = {
    PizzaList: undefined,
    PizzaDetail: { pizzaId: number },
    CreateReview: { pizza: Pizza },
}

const PizzaScreenStack = createNativeStackNavigator<PizzaScreenParamList>();

const PizzaScreen = ({ route, navigation }: Props) => {
    console.log("PizzaScreen render")
    return (
        <PizzaScreenStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <PizzaScreenStack.Screen name="PizzaList" component={PizzaList} />
            <PizzaScreenStack.Screen name="PizzaDetail" component={PizzaDetailScreen} />
            <PizzaScreenStack.Screen name="CreateReview" component={CreateReviewScreen} />
        </PizzaScreenStack.Navigator>
    )
}

export default PizzaScreen;