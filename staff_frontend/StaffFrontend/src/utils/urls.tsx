const API_BASE_URL = "http://192.168.1.39:8082/api" // main 

export const ApiUrls = {
    GET_MENU: `${API_BASE_URL}/menu`,
    GET_PIZZA_URL: `${API_BASE_URL}/menu/pizza`,
    GET_DRINK_URL: `${API_BASE_URL}/menu/drink`,

    // user ---------------------------------------
    POST_REGISTER: `${API_BASE_URL}/user/register`,
    POST_LOGIN: `${API_BASE_URL}/user/login`,
    PUT_USER_DETAILS: `${API_BASE_URL}/user/update`,
    GET_USER_DETAILS: `${API_BASE_URL}/user/details`,
    GET_USER_ORDERS: `${API_BASE_URL}/user/orders`,
    DELETE_USER: `${API_BASE_URL}/user`,
    PUT_USER_IMAGE: `${API_BASE_URL}/user/image-update`,
    POST_REFRESH_TOKEN: `${API_BASE_URL}/user/refreshToken`,

    // reviews
    PUT_REVIEW: `${API_BASE_URL}/reviews/replace`, // +/id
    POST_REVIEW: `${API_BASE_URL}/reviews`,
    DELETE_REVIEW: `${API_BASE_URL}/reviews`, // +/id

    // orders
    POST_ORDER: `${API_BASE_URL}/order`,
    CANCEL_ORDER: `${API_BASE_URL}/order/cancel` // +/id
}