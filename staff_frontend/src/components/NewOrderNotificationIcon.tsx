import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dateTimeParser } from '../utils/BackendDisplayMappers';

interface NewOrderNotificationsIconProps {
  notificationsCount: number;
  containerStyle?: StyleProp<ViewStyle>;
  notificationItems: OrderNotificationItem[]
}

type OrderNotificationItem = {
  onSelect: () => void,
  dateTime: string,
  orderType: string,
}


const NewOrderNotificationIcon: React.FC<NewOrderNotificationsIconProps> = ({ notificationsCount, containerStyle, notificationItems }) => {

  const [expanded, setExpanded] = useState<boolean>(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const notificationFlatListItemHeight = 45;

  const animateList = (toValue: number) => {
    Animated.timing(animatedHeight, {
      toValue,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };


  const onIconClick = () => {
    animateList(expanded ? 0 : notificationItems.length * notificationFlatListItemHeight);
    setExpanded(!expanded);
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={onIconClick}
        style={styles.iconContainer}
        activeOpacity={0.6}>
        <Ionicons name="notifications" size={34} color="black" />
        {notificationsCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{notificationsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
      <Animated.View style={[styles.collapsableAbsolute, { height: animatedHeight }]}>
        <FlatList
          data={notificationItems}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.itemContainer, { height: notificationFlatListItemHeight }]}
              activeOpacity={0.7}
              onPress={item.onSelect}
            >
              <Text style={styles.newText}>nowe!</Text>
              <Text style={styles.dateTimeText}>{dateTimeParser(item.dateTime)}</Text>
              <Text>{item.orderType}</Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 10,
  },
  iconContainer: {
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
  collapsableAbsolute: {
    position: 'absolute',
    top: 50,
    left: 0,
    width: 290,
    // backgroundColor: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  newText: {
    color: 'red',
  },
  dateTimeText: {
    marginHorizontal: 30,
  },
});

export default NewOrderNotificationIcon;
