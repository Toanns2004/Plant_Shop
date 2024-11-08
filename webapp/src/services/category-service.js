import axios from "axios";

const API_URL = "http://localhost:8080/categories";

const getAllCategories = () => {
    return axios.get(API_URL);
};

const categoryDetails = (id) => {
    return axios.get(API_URL + "/id/" + id);
};

const categoryByPrefix = (prefix) => {
    return axios.get(API_URL+"/prefix/"+prefix)
}

const getProductsByCategoryPrefix = (prefix) => {
    return axios.get(API_URL+"/"+prefix)
}

const createCategory = (prefix, cat_name, cat_description, axiosConfig) => {
    return axios.post(API_URL + "/create", {
        prefix, cat_name, cat_description
    }, axiosConfig)
};

const updateCategory = (cat_id, prefix, cat_name, cat_description, axiosConfig) => {
    return axios.put(API_URL + "/update/" + cat_id, {
        prefix, cat_name, cat_description
    }, axiosConfig)
};

const deleteCategory = (cat_id, axiosConfig) => {
    return axios.delete(API_URL + "/delete/" + cat_id, axiosConfig)
};

const categoryService = {
    getAllCategories,
    getProductsByCategoryPrefix,
    categoryDetails,
    categoryByPrefix,
    createCategory,
    updateCategory,
    deleteCategory
};

export default categoryService;


