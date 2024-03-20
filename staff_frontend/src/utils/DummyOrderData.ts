import { UserOrder, PizzaSizes, DrinkSizes, OrderStatus, OrderType } from "./AppTypes";

const userOrders: UserOrder[] = [
  {
    order_id: '1',
    orderedPizzas: [
      { pizzaId: 1, name: 'Margarita', size: PizzaSizes.SMALL, quantity: 2, imageUrl: "https://img.freepik.com/free-psd/pictou-county-pizza-isolated-transparent-background_191095-32844.jpg?w=740&t=st=1710421159~exp=1710421759~hmac=d07084738151a56816d06fbda3b0e2cb1ed8e5e6399f531a3f86ea8eb416065b" },
      { pizzaId: 2, name: 'Margarynaa', size: PizzaSizes.MEDIUM, quantity: 1, imageUrl: "https://img.freepik.com/free-psd/pictou-county-pizza-isolated-transparent-background_191095-32844.jpg?w=740&t=st=1710421159~exp=1710421759~hmac=d07084738151a56816d06fbda3b0e2cb1ed8e5e6399f531a3f86ea8eb416065b" }
    ],
    orderedDrinks: [
      { drinkId: 1, name: 'Coca cola', size: DrinkSizes.SMALL_330, quantity: 3, imageUrl: "https://dtgxwmigmg3gc.cloudfront.net/imagery/assets/derivations/icon/512/512/true/eyJpZCI6IjE3YjUwYjk5NWYyNGJhNmVlYzIzMWMzZTM3YWNhMmM4Iiwic3RvcmFnZSI6InB1YmxpY19zdG9yZSJ9?signature=d4f76b3c4a3ab89faa526397c82621018685dd7033f9fe946c6701a43d804d0f" },
      { drinkId: 2, name: 'Coca pepsi', size: DrinkSizes.BIG_1000, quantity: 1, imageUrl: "https://dtgxwmigmg3gc.cloudfront.net/imagery/assets/derivations/icon/512/512/true/eyJpZCI6IjE3YjUwYjk5NWYyNGJhNmVlYzIzMWMzZTM3YWNhMmM4Iiwic3RvcmFnZSI6InB1YmxpY19zdG9yZSJ9?signature=d4f76b3c4a3ab89faa526397c82621018685dd7033f9fe946c6701a43d804d0f" }
    ],
    ordererName: 'John Doe',
    deliveryAddress: '123 Main St, City, Country',
    orderStatus: OrderStatus.PENDING,
    orderType: OrderType.DELIVERY,
    phone: '123456789',
    createdAt: '2024-03-15T10:00:00.000Z',
  },
  {
    order_id: '2',
    orderedPizzas: [
      { pizzaId: 3, name: 'Capricioza', size: PizzaSizes.BIG, quantity: 1, imageUrl: "https://img.freepik.com/free-psd/pictou-county-pizza-isolated-transparent-background_191095-32844.jpg?w=740&t=st=1710421159~exp=1710421759~hmac=d07084738151a56816d06fbda3b0e2cb1ed8e5e6399f531a3f86ea8eb416065b" },
    ],
    orderedDrinks: [
      { drinkId: 3, name: 'Fanta', size: DrinkSizes.MEDIUM_500, quantity: 2, imageUrl: "https://dtgxwmigmg3gc.cloudfront.net/imagery/assets/derivations/icon/512/512/true/eyJpZCI6IjE3YjUwYjk5NWYyNGJhNmVlYzIzMWMzZTM3YWNhMmM4Iiwic3RvcmFnZSI6InB1YmxpY19zdG9yZSJ9?signature=d4f76b3c4a3ab89faa526397c82621018685dd7033f9fe946c6701a43d804d0f" },
    ],
    ordererName: 'Alice Smith',
    deliveryAddress: '456 Elm St, City, Country',
    orderStatus: OrderStatus.IN_PROGRESS,
    orderType: OrderType.DELIVERY,
    phone: '987654321',
    createdAt: '2024-03-16T12:00:00.000Z',
  },
];

export default userOrders;