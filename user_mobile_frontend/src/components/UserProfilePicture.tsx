import React, { useState, useEffect, useContext } from "react";
import { Image, ImageBackground, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from "../contexts/AppContext";
import usePutUserImage from "../hooks/usePutUserImage";
import LoadingIndicator from "./LoadingIndicator";


type Props = {
  imageSource: string | null,
}

export default function UserProfilePicture({ imageSource }: Props) {
  const { userDetails } = useContext(AppContext);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const { loading, putImage } = usePutUserImage();

  useEffect(() => {
    if (selectedImage) {
      putImage(selectedImage);
    }

  }, [selectedImage])

  const onImagePicked = async () => {

    // Ask for permission just before opening the image picker
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.7,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      if (result.assets) {
        console.log("selected image uri: " + result.assets[0].uri);
        setSelectedImage(result.assets[0].uri);
      }
    }
  }

  // because userimage is always the of the same name => set it quickly to null, then to original once again
  // useEffect(() => {

  // }, [userDetails!.imageUrl])
  
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* obraz się może nie zmieniać ponieważ url pozostaje zawsze ten sam */}
        <Image source={userDetails!.imageUrl ? { uri: userDetails!.imageUrl } : require('../../assets/images/no-user.png')} style={styles.image} />
      </View>
      <TouchableOpacity style={styles.editIconContainer} onPress={onImagePicked}>
        <MaterialCommunityIcons name="image-edit" size={24} color="black" />
      </TouchableOpacity>
      {loading && <LoadingIndicator />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 150,
    height: 150,
    overflow: 'visible',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'tomato',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    overflow: 'hidden',
    width: '90%',
    height: '90%',
    borderRadius: 100,
  }
});