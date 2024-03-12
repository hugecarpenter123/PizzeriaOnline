import { NavigationContainer } from '@react-navigation/native';
import AppStacks from './src/screens/AppStacks';
import AppContextProvider from './src/contexts/AppContext';
import { enableFreeze, enableScreens } from 'react-native-screens';

enableScreens();
enableFreeze();

export default function App() {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <AppStacks />
      </NavigationContainer>
    </AppContextProvider>
  );
}