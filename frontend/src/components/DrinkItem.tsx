import React, { useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ToastAndroid } from "react-native";
import { Drink, DrinkSizes, MainScreenContext, OrderItemType } from '../contexts/MainScreenContext';
import showToast from "../utils/showToast";

type Props = {
  drink: Drink;
};


const DrinkItem = ({ drink }: Props) => {

  const { addOrderItem } = useContext(MainScreenContext);
  const [selected, setSelected] = useState(1)
  const drinkSizePrices = [
    {
      size: 330,
      price: drink.smallSizePrice
    },
    {
      size: 500,
      price: drink.smallSizePrice
    },
    {
      size: 1000,
      price: drink.smallSizePrice
    }
  ]

  const onAddToOrderClick = (drinkId: number, size: number) => {
    addOrderItem(drinkId, OrderItemType.DRINK, size);
    showToast("Dodano do zamówienia", ToastAndroid.SHORT);
  }

  const renderSizes = () => {
    return (
      drinkSizePrices.map(({ size, price }, index) => (
        <View style={styles.singleSizeWrapper} key={index}>
          <Text style={styles.priceCaption}>{`${price}zł`}</Text>
          <TouchableOpacity
            key={size}
            style={[styles.sizeButton, index === selected ? styles.drinkSizeSelected : null]}
            onPress={() => setSelected(index)}
          >
            <Text style={[styles.sizeText]}>{`${size}ml`}</Text>
          </TouchableOpacity>
        </View>
      ))
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image source={{ uri: drink.imageUrl }} style={styles.image} />
        <View style={styles.subInfoContainer}>
          <Text style={styles.name}>{drink.name}</Text>
          <View style={styles.sizeContainer}>
            {renderSizes()}
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => onAddToOrderClick(drink.id, selected)}>
        <Text style={styles.addButtonText}>Dodaj</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DrinkItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    resizeMode: 'contain'
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center'
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    paddingVertical: 5
  },
  sizeContainer: {
    flexDirection: "row",
  },
  sizeButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  sizeText: {
    fontSize: 12,
  },
  addButton: {
    backgroundColor: "tomato",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  subInfoContainer: {
    flexDirection: 'column'
  },
  drinkSizeSelected: {
    backgroundColor: 'tomato',
  },
  singleSizeWrapper: {
    alignItems: 'center',
    marginRight: 8
  },
  priceCaption: {
    marginBottom: 4,
    fontSize: 13
  }
});
