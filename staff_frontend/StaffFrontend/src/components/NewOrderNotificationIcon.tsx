import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NewOrderNotificationsIconProps {
  notificationsCount: number;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const NewOrderNotificationIcon: React.FC<NewOrderNotificationsIconProps> = ({ notificationsCount, onPress, containerStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, containerStyle]}>
      <View style={styles.iconContainer}>
        <Ionicons name="notifications" size={24} color="black" /> {/* Ikona */}
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

export default NewOrderNotificationIcon;
