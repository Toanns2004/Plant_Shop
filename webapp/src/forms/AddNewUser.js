import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Swal from "sweetalert2";
import UserService from "../services/user-service";


const AddNewUser = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [role, setRole] = useState("user");

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
    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    }
    const onChangeFullName = (e) => {
        setFullName(e.target.value);
    }
    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value);
        checkPasswordMatch(e.target.value, passwordConfirm);
    }
    const onChangePasswordConfirm = (e) => {
        setPasswordConfirm(e.target.value);
        checkPasswordMatch(password, e.target.value);
    }

    const onChangeRole = (e) => {
        const newRole = e.target.value;
        setRole(newRole);
    }

    const checkPasswordMatch = (password, confirm) => {
        setPasswordsMatch(password === confirm);
    }

    const handleAddUser = (e) => {
        e.preventDefault();
        if(passwordsMatch){
            UserService.addUser(username, fullname, email, password, role, axiosConfig)
                .then((response) => {
                    setMessage("Add user successfully!");
                    Swal.fire({
                        title: 'Success',
                        text: 'Add new user successfully!',
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
        else {
            setMessage("Password do not match!")
        }
    }

    useEffect(() => {
        usernameRef.current.focus();
    }, [])

    return(
        <div className="add-form vh-100">
            <h2>Add New User:</h2>
            <form onSubmit={handleAddUser}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="name@example.com"
                        name="username"
                        value={username}
                        onChange={onChangeUsername}
                        ref={usernameRef}
                    />
                        <label htmlFor="username">Username</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text"
                           className="form-control"
                           id="fullname"
                           placeholder="name@example.com"
                           name="fullname"
                           value={fullname}
                           onChange={onChangeFullName}
                    />
                    <label htmlFor="fullname">Full Name</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email"
                           className="form-control"
                           id="email"
                           placeholder="name@example.com"
                           name="email"
                           value={email}
                           onChange={onChangeEmail}
                    />
                    <label htmlFor="email">Email address</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="password"
                           className="form-control"
                           id="password"
                           placeholder="name@example.com"
                           name="phone"
                           value={password}
                           onChange={onChangePassword}
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="re-password"
                        placeholder="name@example.com"
                        name="password"
                        value={passwordConfirm}
                        onChange={onChangePasswordConfirm}
                    />
                    <label htmlFor="re-password">Re-enter Password</label>
                </div>
                <select onChange={onChangeRole} className="form-select" aria-label="role">
                    <option selected value="admin">Admin</option>
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
                    <button type="submit" className="btn add-btn"><i className="bi bi-plus-lg"></i> Add</button>
                    <Link to="/admin/viewusers">
                        <button className="btn btn-danger"><i className="bi bi-x-lg"></i> Cancel</button>
                    </Link>
                </div>

            </form>
        </div>
    )
}
export default AddNewUser;