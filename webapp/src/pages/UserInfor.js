
import '../assets/css/info.css'
import {useEffect, useState} from "react";
import AuthService from "../services/auth-service";
import Swal from "sweetalert2";
import authService from "../services/auth-service";
import userService from "../services/user-service";
import authEventEmitter from "../services/authEvents";
const UserInfor = () => {
    const IMG_URL = "http://localhost:8080/images/";

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }
    const [currentUser, setCurrentUser] = useState({});
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [selectedImage, setSelectedImage] = useState([])
    const [updateUser, setUpdateUser] = useState({
        fullname: '',
        phone: '',
    })

    const [message, setMessage] = useState("");

    const onChangeCurrentPassword = (e) => {
        setCurrentPassword(e.target.value);
    }
    const onChangeNewPassword = (e) => {
        setNewPassword(e.target.value);
        checkPasswordMatch(e.target.value, newPasswordConfirm);
    }
    const onChangeNewPasswordConfirm = (e) => {
        setNewPasswordConfirm(e.target.value);
        checkPasswordMatch(newPassword, e.target.value);
    }

    const onChange = (e) => {
        const {name, value} = e.target;
        setUpdateUser(prevUser => ({
            ...prevUser, [name] : value
        }));
    }

    const checkPasswordMatch = (password, confirm) => {
        setPasswordsMatch(password === confirm);
    }


    const handleChangePassword = (e) => {
        e.preventDefault();
        if(passwordsMatch){
            AuthService.changePassword(user.token, currentPassword, newPassword)
                .then((response) => {
                    setMessage("Password change successfully!");
                    Swal.fire({
                        title: 'Successfully!',
                        text: 'Password change successfully!',
                        icon: 'success',
                        confirmButtonText: 'Ok!',
                        confirmButtonColor: '#5ba515'
                    });
                })
                .catch((error) => {
                    const resMessage =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setMessage(resMessage);
                });
        }
        else {
            setMessage("New password do not match!")
        }
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const imageFiles = files.filter(file => file.type.startsWith('image'));

        setSelectedImage(imageFiles);
    };
    const handleImageUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("id", user.id);
        if (selectedImage && selectedImage.length > 0) {
            formData.append("image", selectedImage[0]);
        }
        authService.updateImage(formData, axiosConfig)
            .then((response) => {
                setMessage("Success!");
                authEventEmitter.emit("changeImageSuccess");
                Swal.fire({
                    title: 'Success',
                    text: 'Avatar changed successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok!',
                    confirmButtonColor: '#5ba515'
                });
            })
            .catch((error) => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage(resMessage);
            });

    };

    const handleUpdateInfo = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("id", user.id);
        formData.append("newFullName", updateUser.fullname);
        formData.append("newPhone", updateUser.phone);

        authService.updateInfo(formData, axiosConfig)
            .then((response) => {
                setMessage("Success!");
                authEventEmitter.emit("changeInfoSuccess");
                Swal.fire({
                    title: 'Success',
                    text: 'Informations changed successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok!',
                    confirmButtonColor: '#5ba515'
                });
            })
            .catch((error) => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage(resMessage);
            });
    }

    useEffect(() => {
        userService.userDetails(user.id,axiosConfig)
            .then(res => {
                setCurrentUser(res.data);
                setUpdateUser(res.data)
            })
        const updateCurrentUser = () => {
            userService.userDetails(user.id,axiosConfig)
                .then(res => {
                    setCurrentUser(res.data);
                })
        }
        authEventEmitter.on("changeImageSuccess", updateCurrentUser);
        authEventEmitter.on("changeInfoSuccess", updateCurrentUser);

        return () => {
            authEventEmitter.off("changeImageSuccess", updateCurrentUser);
            authEventEmitter.off("changeInfoSuccess", updateCurrentUser);
        }
    }, [authEventEmitter]);



    return(
        <div className="container">
            <div className="info-page">
                <h2>User informations:</h2>
                <div className="text-center">
                    {currentUser.image ? (
                        <img src={IMG_URL + currentUser.image} alt="" width="200" />
                    ) : (
                        <img src={IMG_URL + "blankavatar.png"} alt="" width="200" />
                    )}
                    <br/>
                    <br/>
                    <h4>Hello, {currentUser.fullname}</h4>
                    <br/>
                    <div className="row">
                        <div className="col-3"></div>
                        <div className="col-6">
                            <div className="text-start">
                                <h5>Username: {currentUser.username}</h5>
                                <h5>Email: {currentUser.email}</h5>
                                <h5>Phone number: {currentUser.phone}</h5>
                            </div>
                            <br/>
                            <div className="text-center">
                                <button className=" add-btn" data-bs-toggle="modal" data-bs-target="#changePassword"><i
                                    className="bi bi-key"></i> Change Password</button>
                                <button className=" detail-btn" data-bs-toggle="modal" data-bs-target="#changeImage">
                                    <i className="bi bi-person-bounding-box"></i> Change Avatar</button>
                                <button className=" edit-btn" data-bs-toggle="modal" data-bs-target="#changeInfo">
                                    <i className="bi bi-info-circle"></i> Change Informations</button>
                            </div>
                            <br/>
                        </div>
                        <div className="col-3"></div>
                    </div>

                </div>
            </div>
            <div className="modal fade" id="changePassword" tabIndex="-1" aria-labelledby="changePassword"
                 aria-hidden="true">
                <form onSubmit={handleChangePassword}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="changePassword">Change Password</h1>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="currentPass"
                                        name="currentPassword"
                                        value={currentPassword}
                                        onChange={onChangeCurrentPassword}
                                        required
                                        placeholder="Password"/>
                                    <label htmlFor="currentPass">Enter current password</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="newPass"
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={onChangeNewPassword}
                                        required
                                        placeholder="Password"/>
                                    <label htmlFor="newPass">Enter new password</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password"
                                           className="form-control"
                                           name="confirmPassword"
                                           value={newPasswordConfirm}
                                           onChange={onChangeNewPasswordConfirm}
                                           required
                                           id="newPassCfm"
                                           placeholder="Password"/>
                                    <label htmlFor="newPassCfm">Re-enter new password</label>
                                </div>
                                {message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
                                            {message}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="add-btn">Save changes</button>
                                <button type="button" className="delete-btn" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal fade" id="changeImage" tabIndex="-1" aria-labelledby="changeImage"
                 aria-hidden="true">
                <form onSubmit={handleImageUpdate} encType="multipart/form-data">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="changeImage">Change Image</h1>
                            </div>
                            <div className="modal-body">
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon1">Choose New Avatar</span>
                                    <input type="file"
                                           className="form-control"
                                           placeholder="images"
                                           aria-label="images"
                                           aria-describedby="basic-addon1"
                                           name="thumbnail"
                                           onChange={handleImageChange}
                                    />
                                </div>
                                <div className="preview-images">
                                    {selectedImage && selectedImage.map((image, index) => (
                                        <img
                                            key={index}
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index}`}
                                            className="preview-image"
                                            width="100%"
                                            style={{ margin: '5px', border: 'solid 1px #5ba515' }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="add-btn">Save changes</button>
                                <button type="button" className="delete-btn" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal fade" id="changeInfo" tabIndex="-1" aria-labelledby="changeInfo"
                 aria-hidden="true">
                <form onSubmit={handleUpdateInfo}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="changeInfo">Change informations</h1>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-3">
                                    <input type="text"
                                           className="form-control"
                                           id="inputname"
                                           placeholder="name"
                                           name="fullname"
                                           value={updateUser.fullname}
                                           onChange={onChange}
                                    />
                                        <label htmlFor="inputname">Full name</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="text"
                                           className="form-control"
                                           id="inputphone"
                                           placeholder="phone"
                                           name="phone"
                                           value={updateUser.phone}
                                           onChange={onChange}
                                    />
                                        <label htmlFor="inputphone">Phone number</label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="add-btn">Save changes</button>
                                <button type="button" className="delete-btn" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default UserInfor;