import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
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

  useEffect(() => {
    expanded && animateList(notificationItems.length * notificationFlatListItemHeight);
  }, [notificationsCount])

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
          style={styles.collapsibleFlatList}
          data={notificationItems}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.itemContainer, { height: notificationFlatListItemHeight }]}
              activeOpacity={0.7}
              onPress={(item.onSelect)}
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
    top: 45,
    left: 0,
    width: 300,
    maxHeight: 500,
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomColor: 'black',
  },
  newText: {
    color: 'red',
  },
  dateTimeText: {
    marginHorizontal: 30,
  },
  collapsibleFlatList: {
  }
});

export default NewOrderNotificationIcon;
