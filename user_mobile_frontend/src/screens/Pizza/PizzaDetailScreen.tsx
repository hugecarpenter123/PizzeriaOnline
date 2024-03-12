import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView, Text, StyleSheet, TouchableOpacity, ScrollView, Image, View, FlatList } from "react-native";
import { PizzaScreenParamList } from "./PizzaScreen";
import { MainScreenContext, Pizza, Review } from "../../contexts/MainScreenContext"
import RenderPizzaReviewItem from "../../components/RenderPizzaReviewItem";
import { AppContext } from "../../contexts/AppContext";

type Props = NativeStackScreenProps<PizzaScreenParamList, "PizzaDetail">;

function PizzaDetailScreen({ route, navigation }: Props) {
  console.log("PizzaDetailScreen render");

  const { menu } = useContext(MainScreenContext);
  const { pizzaId } = route.params;
  const pizza = menu?.pizzaList.filter((pizza) => pizza.id === pizzaId)[0];
  const { token } = useContext(AppContext);

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const renderPizzaReviews = () => {
    if (pizza) {
      return (
        pizza.reviews.map((item, index) => {
          return <RenderPizzaReviewItem item={item} key={index} />
        })
      )
    } else {
      return <View></View>
    }
  }

  const addNewReview = () => {
    navigation.navigate('CreateReview', {pizza: pizza as Pizza})
  }

  if (!pizza) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Soemthing went wrong, please try refreshing</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          style={styles.pizzaImage}
          source={{
            uri: pizza.imageUrl,
          }}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.pizzaName}>{pizza.name}</Text>
          <Text style={styles.title}>Składniki:</Text>
          <Text style={styles.pizzaIngredients}>{pizza.ingredients.join(", ")}</Text>
          <Text style={styles.pizzaPrice}>Cena:</Text>
          <Text style={styles.pizzaSizePrice}>Mała: {pizza.smallSizePrice} zł</Text>
          <Text style={styles.pizzaSizePrice}>Średnia: {pizza.mediumSizePrice} zł</Text>
          <Text style={styles.pizzaSizePrice}>Duża: {pizza.bigSizePrice} zł</Text>
          <Text style={styles.title}>Opinie:</Text>
          {token && <TouchableOpacity onPress={addNewReview} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>}
        </View>
        {renderPizzaReviews()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  pizzaImage: {
    width: 300,
    maxWidth: '90%',
    height: 200,
    resizeMode: "cover",
    marginTop: 20,
    borderRadius: 5,
  },
  infoContainer: {
    width: "100%",
    padding: 20,
    marginTop: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  pizzaName: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pizzaIngredients: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  pizzaPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pizzaSizePrice: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  addButton: {
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  }

});

export default PizzaDetailScreen;