import React, { useState, useEffect } from 'react';
import { View, StatusBar, Image, StyleSheet } from 'react-native';

type SplashScreenProps = {
    source?: number,
}

type useAppInitializerResultProps = {
    appInitialized: boolean,
    SplashScreen: React.FC<SplashScreenProps>,
}

const useAppInitializer = (): useAppInitializerResultProps => {
    const [appInitialized, setAppInitialized] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAppInitialized(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const SplashScreen: React.FC<SplashScreenProps> = ({source}) => {
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <Image source={source || require('../../assets/images/splash-screen.webp')} style={styles.backgroundImage} />
            </View>
        )
    }

    return {
        appInitialized, 
        SplashScreen
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

export default useAppInitializer;