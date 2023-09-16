import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MainScreenContextProvider from "../contexts/MainScreenContext";
import MainScreen from "./MainScreen";
import { RootStackParamList } from "./AppStacks";


type Props = NativeStackScreenProps<RootStackParamList, "MainScreen">

export default function MainScreenWithContext({ route, navigation }: Props ) {
    return (
      <MainScreenContextProvider>
        <MainScreen route={route} navigation={navigation} />
      </MainScreenContextProvider>
    );
  }