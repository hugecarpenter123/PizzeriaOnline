import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { OrderItemType } from "../contexts/MainScreenContext";


type Props = {
  item: CartItemProps
}

export type CartItemProps = {
  type: OrderItemType
  imageUrl: string,
  name: string,
  size: number,
  quantity: number,
  price: number,
  increase: () => void,
  decrease: () => void,
  delete: () => void
}

export default function CartItem({ item }: Props) {
  console.log('create CartItem')
  const drinkSizes = ['330ml', '500ml', '1000ml']
  const pizzaSizes = ['mała', 'średnia', 'duża']

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.size}>Rozmiar: {item.type === OrderItemType.PIZZA ? pizzaSizes[item.size] : drinkSizes[item.size]}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={item.decrease} style={styles.quantityButtonContainer}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={item.increase} style={styles.quantityButtonContainer}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
          <Text style={styles.price}>x {item.price.toFixed(2)}zł</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.removeButton} onPress={item.delete}>
        <Text style={styles.removeButtonText}>Usuń</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 20,
    borderRadius: 50,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  size: {
    fontSize: 14,
    color: "#555",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  quantityButtonContainer: {
    width: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  quantityButton: {
    fontSize: 18,
    color: "white",
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  removeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    backgroundColor: "tomato",
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    padding: 10,
  },
  price: {
    marginLeft: 5,
  }
});