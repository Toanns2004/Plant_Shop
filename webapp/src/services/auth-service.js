import axios from "axios";

const API_URL = "http://localhost:8080/auth/";

const login = (username, password) => {
    return axios.post(API_URL + "login", {
        username,
        password
    })
        .then(response => {
            if (response.data.token) {
                sessionStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        }).catch(error => {
            console.error("auth login err: ", error);
        });

}

const logout = () => {
    sessionStorage.removeItem('user');
}

const register = (username, fullname, email, phone, password) => {
    return axios.post(API_URL + "register", {
        username,
        fullname,
        email,
        phone,
        password
    });
};
const changePassword = (token, currentPassword, newPassword) => {
    return axios.post(API_URL+"change-password", {
        token,
        currentPassword,
        newPassword
    })
}
const updateImage = (formData, axiosConfig) => {
    return axios.put(API_URL+"change-image", formData, axiosConfig)
}
const updateInfo = (formData, axiosConfig) => {
    return axios.put(API_URL+"change-info", formData, axiosConfig)
}

const getCurrentUser = () => {
    return JSON.parse(sessionStorage.getItem('user'));
}


const authService = {
    login,
    logout,
    register,
    changePassword,
    updateImage,
    updateInfo,
    getCurrentUser,
};

export default authService;
