import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import userService from "../services/user-service";
import UserService from "../services/user-service";
import Swal from "sweetalert2";

const EditUser = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [updateUser, setUpdateUser] = useState({
        username: '',
        fullname: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        image: ''
    })


    const [message, setMessage] = useState("");
    const usernameRef = useRef(null);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user.token;




    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }
    const onChange = (e) => {
        const {name, value} = e.target;
        setUpdateUser(prevUser => ({
            ...prevUser, [name] : value
        }));
    }

    useEffect(() => {
        usernameRef.current.focus();
        userService.userDetails(id, axiosConfig)
            .then(response => {
                setUpdateUser(response.data)
            })
            .catch(error => {
                console.error("Get user details Error: ", error)
            })
    }, [id])

    const handleEditUser = (e) => {
        e.preventDefault();
        const editUser = {
            ...updateUser,
        }
        UserService.editUser(id, editUser.username, editUser.fullname, editUser.email, editUser.phone, editUser.password, editUser.role, editUser.image, axiosConfig)
            .then((response) => {
                setMessage("Update user successfully!");
                Swal.fire({
                    title: 'Success',
                    text: 'User updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok!',
                    confirmButtonColor: '#5ba515'
                });
                navigate("/admin/viewusers");
            })
            .catch((error) => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage(resMessage);
            });
    }
    return(
        <div className="add-form vh-100">
            <h2>Edit User:</h2>
            <form onSubmit={handleEditUser}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="name@example.com"
                        name="username"
                        value={updateUser.username}
                        onChange={onChange}
                        ref={usernameRef}
                        disabled
                    />
                    <label htmlFor="username">Username</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text"
                           className="form-control"
                           id="fullname"
                           placeholder="name@example.com"
                           name="fullname"
                           value={updateUser.fullname}
                           onChange={onChange}
                    />
                    <label htmlFor="fullname">Full Name</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email"
                           className="form-control"
                           id="email"
                           placeholder="name@example.com"
                           name="email"
                           value={updateUser.email}
                           onChange={onChange}
                    />
                    <label htmlFor="email">Email address</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="number"
                           className="form-control"
                           id="phone"
                           placeholder="name@example.com"
                           name="phone"
                           value={updateUser.phone}
                           onChange={onChange}
                    />
                    <label htmlFor="phone">Phone number</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="password"
                           className="form-control"
                           id="password"
                           placeholder="name@example.com"
                           name="password"
                           value={updateUser.password}
                           onChange={onChange}
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <select onChange={onChange} value={updateUser.role} className="form-select" aria-label="role" name="role">
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <br/>
                {message && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    </div>
                )}

                <div className="text-center">
                    <button type="submit" className="btn add-btn"><i className="bi bi-pencil-square"></i> Update</button>
                    <Link to="/admin/viewusers">
                        <button className="btn btn-danger"><i className="bi bi-x-lg"></i> Cancel</button>
                    </Link>
                </div>

            </form>
        </div>
    )
}
export default EditUser;