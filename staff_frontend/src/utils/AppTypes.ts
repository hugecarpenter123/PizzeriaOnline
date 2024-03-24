export type Order = {
    orderId: string,
    orderedPizzas: orderedPizza[],
    orderedDrinks: orderedDrink[],
    ordererName: string,
    deliveryAddress: string,
    orderStatus: OrderStatus,
    orderType: OrderType,
    phone: string,
    createdAt: string,
}

export type orderedDrink = {
    imageUrl: string,
    drinkId: number,
    name: string,
    size: DrinkSizes,
    quantity: number
}

export type orderedPizza = {
    imageUrl: string,
    pizzaId: number,
    name: string,
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
    SMALL_330 = "Small (330ml)",
    MEDIUM_500 = "Medium (500ml)",
    BIG_1000 = "Big (1000ml)"
}


export enum PizzaSizes {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    BIG = "BIG"
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


export enum OrderType {
    DELIVERY = "DELIVERY",
    PICKUP = "PICKUP",
}

export enum OrderStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
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
