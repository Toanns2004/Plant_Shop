import '../assets/css/login.css';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import 'popper.js';
import { isEmail } from "validator";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth-service";
import data from "bootstrap/js/src/dom/data";
import {Button, Toast, ToastContainer} from "react-bootstrap";
import Swal from "sweetalert2";
import authService from "../services/auth-service";

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [message, setMessage] = useState("");
    const usernameRef = useRef(null);
    const [isLogin, setIsLogin] = useState(false);

    //validate
    // const required = value => {
    //     if (!value) {
    //         return 'This field is required!'
    //     }
    // };
    //
    // const vemail = value => {
    //     if (!isEmail(value)) {
    //         return 'Email is not valid!';
    //     }
    // };

    // const vusername = value => {
    //     if (value.length < 3 || value.length > 20) {
    //         return'The username must be between 3 and 20 characters.';
    //     }
    // };
    //
    // const vpassword = value => {
    //     if (value.length < 6 || value.length > 40) {
    //         return 'The password must be between 6 and 40 characters!';
    //     }
    // };

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    }
    const onChangeFullName = (e) => {
        setFullName(e.target.value);
    }
    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const onChangePhone = (e) => {
        setPhone(e.target.value);
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value);
        checkPasswordMatch(e.target.value, passwordConfirm);
    }
    const onChangePasswordConfirm = (e) => {
        setPasswordConfirm(e.target.value);
        checkPasswordMatch(password, e.target.value);
    }

    const checkPasswordMatch = (password, confirm) => {
        setPasswordsMatch(password === confirm);
    }


    const handleRegister = (e) => {
        e.preventDefault();
        if(passwordsMatch){
            AuthService.register(username, fullName, email, phone, password)
                .then((response) => {
                    setMessage("Register successfully!");
                    Swal.fire({
                        title: 'Register Successfully!',
                        text: 'Now you can Login with new Account!',
                        icon: 'success',
                        confirmButtonText: 'Login now!',
                        confirmButtonColor: '#5ba515'
                    });
                    navigate("/login");
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

    const checkLogin = () => {
        const user = authService.getCurrentUser();
        if(user){
            setIsLogin(true);
        }
    }
    if(isLogin){
        navigate("/")
    }

    useEffect(() => {
        usernameRef.current.focus();
        checkLogin();
    }, [])

    return(
        <>
           <div className="container login-page">
               <div className="row">
                   <div className="col-7">
                   </div>
                   <div className="col-5">
                       <h1 className="text-center">
                           Register
                       </h1>
                       <form onSubmit={handleRegister}>
                           <div className="form-floating mb-3">
                               <input type="text"
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
                                      value={fullName}
                                      onChange={onChangeFullName}
                               />
                               <label htmlFor="fullname">Full name</label>
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
                               <input type="text"
                                      className="form-control"
                                      id="phone"
                                      placeholder="name@example.com"
                                      name="phone"
                                      value={phone}
                                      onChange={onChangePhone}
                               />
                               <label htmlFor="phone">Phone number</label>
                           </div>
                           <div className="form-floating mb-3">
                               <input type="password"
                                      className="form-control"
                                      id="password"
                                      placeholder="name@example.com"
                                      name="password"
                                      value={password}
                                      onChange={onChangePassword}
                               />
                               <label htmlFor="password">Password</label>
                           </div>
                           <div className="form-floating mb-3">
                               <input type="password"
                                      className="form-control"
                                      id="re-password"
                                      placeholder="name@example.com"
                                      onChange={onChangePasswordConfirm}
                               />
                               <label htmlFor="re-password">Re-enter password</label>
                           </div>
                           {message && (
                               <div className="form-group">
                                   <div className="alert alert-danger" role="alert">
                                       {message}
                                   </div>
                               </div>
                           )}
                           <br/>
                           <div className="d-flex justify-content-center">
                               <button type="submit" className="btn btn-lg login-btn">Submit</button>
                           </div>
                       </form>
                       <br/>
                       <h5 className="text-center">Already have an account? <Link to="/login"><i>Login here</i></Link></h5>
                   </div>
               </div>
           </div>
        </>
    )
}
export default Register;