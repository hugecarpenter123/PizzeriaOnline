import React, { memo, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TouchableNativeFeedback, useColorScheme } from "react-native";
import { Pizza } from "../contexts/MainScreenContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../screens/AppStacks";
import { PizzaScreenParamList } from "../screens/Pizza/PizzaScreen";
import { commonStyles } from "../utils/StaticAppInfo";

type Props = {
  pizza: Pizza,
  addToCart: (pizzaId: number, size: number) => void,
  navigation: NativeStackNavigationProp<PizzaScreenParamList & RootStackParamList, "PizzaList">;
}

const PizzaItem = ({ pizza, addToCart, navigation }: Props) => {
  console.log(`PizzaItem -${pizza.id}- render`);

  const [selectedPriceIndex, setSelectedPriceIndex] = useState(1);
  const onPizzaDetailsPress = (pizzaId: number) => {
    navigation.navigate('PizzaDetail', { pizzaId })
  }

  const pizzaPrices = [pizza.smallSizePrice, pizza.mediumSizePrice, pizza.bigSizePrice]
  const pizzaSizes = ["Mała", "Średnia", "Duża"]


  return (
    <TouchableNativeFeedback onPress={() => onPizzaDetailsPress(pizza.id)}>
      <View style={styles.pizzaItem}>
        <View style={styles.pizzaContainer}>
          <View style={styles.pizzaDetails}>
            <Text style={styles.pizzaName}>{pizza.name}</Text>
            <Text style={styles.pizzaIngredients}>
              {pizza.ingredients.join(", ")}
            </Text>
            <View style={styles.pizzaPricesContainer}>
              {pizzaPrices.map((price, index) => (
                <View style={styles.singleSizeWrapper} key={index}>
                  <Text style={styles.priceCaption}>{`${price}zł`}</Text>
                  <TouchableOpacity
                    key={`${price}-${index}`}
                    style={[styles.sizeButton, index === selectedPriceIndex ? styles.pizzaSizeSelected : null]}
                    onPress={() => setSelectedPriceIndex(index)}
                  >
                    <Text style={[styles.sizeText]}>{`${pizzaSizes[index]}`}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addToCart(pizza.id, selectedPriceIndex)}
          >
            <Text style={styles.addButtonText}>Dodaj</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  pizzaItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pizzaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pizzaDetails: {
    flex: 1,
    marginRight: 10,
  },
  pizzaName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pizzaIngredients: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  pizzaPrices: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pizzaPricesContainer: {
    flexDirection: "row",
  },
  pizzaPrice: {
    fontSize: 16,
    marginRight: 10,
  },
  selectedPrice: {
    color: "tomato",
    textDecorationLine: "underline",
  },

  pizzaSizeSelected: {
    backgroundColor: 'tomato',
  },
  singleSizeWrapper: {
    alignItems: 'center',
    marginRight: 8
  },
  priceCaption: {
    marginBottom: 4,
    fontSize: 13
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
});


export default memo(PizzaItem);