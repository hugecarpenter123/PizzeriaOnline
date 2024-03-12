import { NavigationProp, useNavigation, CommonActions } from "@react-navigation/native"
import { useContext } from 'react'
import { AppContext } from "../contexts/AppContext"
import { RootStackParamList } from "../screens/AppStacks";

const useForceLogout = () => {
    const { logout } = useContext(AppContext);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const navigateToLoginPage = () => {
        navigation.dispatch({
            ...CommonActions.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
            }),
        });
    }

    const forceLogout = () => {
        logout()
        navigateToLoginPage();
    }
    
    return forceLogout
}

export default useForceLogout;