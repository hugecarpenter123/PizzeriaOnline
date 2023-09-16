import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppStacks from './src/screens/AppStacks';
import AppContextProvider from './src/contexts/AppContext';
import { enableScreens } from 'react-native-screens';
import MyStatusBar from './src/components/MyStatusBar';

enableScreens();

export default function App() {
  return (
    <AppContextProvider>
      <NavigationContainer>
        <AppStacks />
      </NavigationContainer>
    </AppContextProvider>
  );
}