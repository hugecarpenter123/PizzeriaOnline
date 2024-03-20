import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface UpdateRequestIconProps {
  notificationsCount: number;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const UpdateRequestIcon: React.FC<UpdateRequestIconProps> = ({ notificationsCount, onPress, containerStyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}
      activeOpacity={0.6}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="update" size={34} color="black" />
        {notificationsCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{notificationsCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UpdateRequestIcon;
