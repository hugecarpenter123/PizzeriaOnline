import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { UserOrder } from '../contexts/MainScreenContext';
import useDeleteOrder from '../hooks/useDeleteOrder';
import OrderHistoryItems from './OrderHistoryItems';

type Props = {
  order: UserOrder,
}

const OrderListItem = ({ order }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { deleteOrder, error: deleteOrderError } = useDeleteOrder();

  const statusMapper: { [key: string]: { [key: string]: string } } = {
    "PENDING": { color: 'lightblue', label: "OCZEKUJĄCE" },
    "IN_PROGESS": { color: 'orange', label: "W TRAKCIE" },
    "COMPLETED": { color: 'green', label: "ZAKOŃCZONE" },
    "CANCELLED": { color: 'red', label: "ANULOWANE" },
  }

  const orderTypeMapper = {
    "DELIVERY": "Dostawa",
    "PICKUP": "Odbiór osobisty"
  }

  const statusColor = statusMapper[order.orderStatus].color;
  const statusLabel = statusMapper[order.orderStatus].label;

  const formattedDateTime = new Date(order.createdAt).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const toggleExpansion = () => {
    setExpanded(!expanded);
  }

  const onCancelOrderPressed = () => {
    deleteOrder(order.orderId);
  }

  return (
    <View style={styles.itemContainer}>
      <View style={styles.listItem}>
        <Text>{order.orderId}</Text>
        <View style={styles.header}>
          <Text style={styles.date}>{formattedDateTime}</Text>
          <Text style={styles.orderType}>{orderTypeMapper[order.orderType]}</Text>
          <Text style={[styles.status, { color: statusColor }]}>{statusLabel}</Text>
        </View>
        <TouchableOpacity onPress={onCancelOrderPressed} style={styles.cancelContainer}>
          {order.orderStatus === "PENDING" && <FontAwesome name="remove" size={24} color="red" />}
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleExpansion} style={styles.arrowContainer}>
          <AntDesign style={styles.arrow} name={expanded ? 'arrowup' : 'arrowdown'} size={26} />
        </TouchableOpacity>
      </View>
      {/* NOTE: buggy! */}
      <Collapsible collapsed={!expanded} align='top'>
        <OrderHistoryItems order={order} />
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    width: '100%',
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // marginBottom: 10,
  },
  header: {
    marginLeft: 20,
  },
  arrowContainer: {
    // backgroundColor: 'red',
  },
  arrow: {

  },
  date: {

  },
  status: {
    color: 'orange',
    fontWeight: 'bold'
  },
  moreInfo: {
    overflow: 'hidden',
    // borderTopWidth: 1,
    // borderTopColor: 'gray',
  },
  cancelContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingEnd: 20,
    // backgroundColor: 'orange',
  },
  orderType: {
    fontWeight: 'bold'
  }
})

export default OrderListItem;
