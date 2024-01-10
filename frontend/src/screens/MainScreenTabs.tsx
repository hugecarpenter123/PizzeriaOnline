import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "./AppStacks";
import MainScreenContextProvider from "../contexts/MainScreenContext";
import MainScreenTabsInner from "./MainScreenTabsInner";

type Props = NativeStackScreenProps<RootStackParamList, 'MainScreenTabs'>;

export default function MainScreenTabs({ route, navigation }: Props) {
  return (
    <MainScreenContextProvider>
      <MainScreenTabsInner navigation={navigation} />
    </MainScreenContextProvider>
  );
}