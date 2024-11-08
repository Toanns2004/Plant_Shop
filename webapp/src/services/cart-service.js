import axios from "axios";

const API_URL = "http://localhost:8080/cart/";

const getCartItemsOfUser = (id, axiosConfig) => {
    return axios.get(API_URL + id, axiosConfig);
}

const addToCart = (user_id, product_id, quantity, axiosConfig) => {
    return axios.post(API_URL + "add", {
        user_id,
        product_id,
        quantity
    }, axiosConfig)
}
const updateCartItemQty = (cart_id, newQty, axiosConfig) => {
    return axios.put(API_URL+"updateqty/"+cart_id, newQty, axiosConfig);
}
const deleteCartItem = (cart_id, axiosConfig) => {
    return axios.delete(API_URL + "delete/" + cart_id, axiosConfig)
}
const deleteAllCartItem = (id, axiosConfig) => {
    return axios.delete(API_URL + id + "/delete", axiosConfig)
}

const cartService = {
    getCartItemsOfUser,
    addToCart,
    updateCartItemQty,
    deleteCartItem,
    deleteAllCartItem
}

export default cartService;