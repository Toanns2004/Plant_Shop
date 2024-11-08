import axios from "axios";

const API_URL = "http://localhost:8080/products";
const IMG_URL = "http://localhost:8080/images/";


const getAllProducts = () => {
    return axios.get(API_URL);
}

const searchProducts = (searchKey) => {
    return axios.get(API_URL + "/search?key=" + searchKey)
}

const getProductDetails = (product_id) => {
    return axios.get(API_URL + "/" + product_id);
}


const getRelatedProducts = (category_id) => {
    return axios.get(API_URL + "/random/" + category_id);
}
const getNewProducts = () => {
    return axios.get(API_URL+"/top/newest");
}
const getProductImages = (product_id) => {
    return axios.get(API_URL + "/" + product_id + "/images")
}
const deleteImageById = (img_id, axiosConfig) => {
    return axios.delete(IMG_URL+"delete/"+img_id, axiosConfig)
}

const createProduct = (formData, axiosConfig) => {
    return axios.post(API_URL + "/create", formData, axiosConfig)
};

const updateProduct = (product_id, formData, axiosConfig) => {
    return axios.put(API_URL + "/update/" + product_id, formData, axiosConfig)
};

const deleteProduct = (product_id, axiosConfig) => {
    return axios.delete(API_URL + "/delete/" + product_id, axiosConfig)
};

const productService = {
    getAllProducts,
    searchProducts,
    getProductDetails,
    getRelatedProducts,
    getNewProducts,
    getProductImages,
    deleteImageById,
    createProduct,
    updateProduct,
    deleteProduct
}

export default productService;