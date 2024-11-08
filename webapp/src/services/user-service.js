import axios from "axios";

const API_URL = "http://localhost:8080/users";

const getAllUsers = (axiosConfig) => {
    return axios.get(API_URL, axiosConfig)
}

const userDetails = (id, axiosConfig) => {
    return axios.get(API_URL+"/"+id, axiosConfig)
}

const addUser = (username, fullname, email, password, role, axiosConfig) => {
    return axios.post(API_URL + "/add",{
        username,
        fullname,
        email,
        password,
        role
    }, axiosConfig);
};

const editUser = (id, username, fullname, email, phone, password, role, image, axiosConfig) => {
    return axios.put(API_URL + "/update/" + id,{
        username,
        fullname,
        email,
        phone,
        password,
        role,
        image
    }, axiosConfig);
};
const deleteUser = (id, axiosConfig) => {
    return axios.delete(API_URL + "/delete/" + id, axiosConfig)
}

const userService = {
    addUser,
    getAllUsers,
    userDetails,
    deleteUser,
    editUser
}
export default userService;