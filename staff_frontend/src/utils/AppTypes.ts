export type UserOrder = {
    order_id: string,
    orderedPizzas: orderedPizza[],
    orderedDrinks: orderedDrink[],
    ordererName: string,
    deliveryAddress: string,
    orderStatus: OrderStatus,
    orderType: string,
    phone: string,
    createdAt: string,
}

export type orderedDrink = {
    drinkId: number,
    size: DrinkSizes,
    quantity: number
}

export type orderedPizza = {
    pizzaId: number,
    size: PizzaSizes,
    quantity: number
}

export enum OrderItemType {
    PIZZA,
    DRINK
}

export enum OrderRemoveType {
    SINGLE,
    ALL
}

export enum DrinkSizes {
    SMALL_330,
    MEDIUM_500,
    BIG_1000
}

export enum PizzaSizes {
    SMALL,
    MEDIUM,
    BIG
}

export interface Order {
    orderedPizzaList: orderedPizza[];
    orderedDrinkList: orderedDrink[];
}


export interface Menu {
    pizzaList: Pizza[];
    drinkList: Drink[];
}

export type Review = {
    id: number,
    userFullName: string,
    userImageUrl: string,
    stars: number,
    content: string,
    createdAt: string,
};

export type Pizza = {
    id: number,
    name: string,
    smallSizePrice: number,
    mediumSizePrice: number,
    bigSizePrice: number,
    ingredients: string[],
    reviews: Review[],
    imageUrl: string,
};

export type Drink = {
    id: number;
    name: string;
    smallSizePrice: number;
    mediumSizePrice: number;
    bigSizePrice: number;
    imageUrl: string,
};

type UserOrderPizza = {
    imageUrl: string,
    name: string,
    size: string,
    quantity: number,
}

type UserOrderDrink = {
    imageUrl: string,
    name: string,
    size: string,
    quantity: number,
}


enum OrderType {
    DELIVERY,
    PICKUP,
}

enum OrderStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED
}

export type UserReview = {
    id: number,
    pizzaId: number,
    imageUrl: string,
    pizzaName: string,
    stars: number,
    content: string,
    createdAt: string, // LocalDateTime
}

export type UserDetails = {
    [key: string]: any;
    id: number,
    imageUrl: string | undefined,
    name: string,
    surname: string,
    email: string,
    city: string,
    cityCode: string,
    street: string,
    houseNumber: string,
    phoneNumber: string,
    dateOfBirth: string,
    reviews: UserReview[],
}

type LoginResponse = {
    token: string,
    userDetails: UserDetails,
}
