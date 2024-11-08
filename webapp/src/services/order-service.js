import axios from "axios";

const API_URL = "http://localhost:8080/orders";

const createOrder = (user_id, total_amount, shipping_address, pay_method, axiosConfig) => {
    return axios.post(API_URL+"/create", {
        user_id,
        total_amount,
        shipping_address,
        pay_method
    }, axiosConfig)
}
const getAllOrders = (axiosConfig) => {
    return axios.get(API_URL, axiosConfig);
}
const getOrderById = (id, axiosConfig) => {
    return axios.get(API_URL+ "/"+id, axiosConfig);
}
const getOrderDetailsByOrderId = (id, axiosConfig) => {
    return axios.get(API_URL+"/"+id+"/details", axiosConfig)
}

const updateOderStatus = (id, newStatus, axiosConfig) => {
    return axios.put(API_URL+"/"+id+"/update", newStatus, axiosConfig)
}
const deleteOrderById = (id, axiosConfig) => {
    return axios.delete(API_URL+"/"+id+"/delete", axiosConfig)
}

const orderService = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrderDetailsByOrderId,
    updateOderStatus,
    deleteOrderById
}

export default orderService;