import '../assets/css/login.css';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import authService from "../services/auth-service";
import authEventEmitter from "../services/authEvents";


const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const usernameRef = useRef(null);
    const [message, setMessage] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    };
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };
    const handleLogin = (e) => {
        e.preventDefault();
        authService.login(username, password)
            .then((response) => {
                console.log(response)
                if (response) {
                    authEventEmitter.emit("loginSuccess");
                } else {
                    setMessage('An error occurred during login. Please try again later.');
                }
            })
            .catch((error) => {
                console.error('Login Error:', error);
                setMessage('Incorrect username or password. Please try again.');
            });
    }

    useEffect(() => {
        usernameRef.current.focus();
        const loginSuccessHandler = () => {
            const user = authService.getCurrentUser();
            if (user && user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        }
        authEventEmitter.on("loginSuccess", loginSuccessHandler);

        return () => {
            authEventEmitter.off("loginSuccess", loginSuccessHandler);
        }
    }, [authEventEmitter])

    return(
        <>
            <div className="container login-page">
                <div className="row">
                    <div className="col-7">
                    </div>
                    <div className="col-5">
                        <h1 className="text-center">Login</h1>
                        <br/>
                        <form onSubmit={handleLogin}>
                            <div className="form-floating mb-3">
                                <input type="text"
                                       className="form-control"
                                       id="username"
                                       placeholder="name@example.com"
                                       name="username"
                                       value={username}
                                       onChange={handleChangeUsername}
                                       required
                                       ref={usernameRef}
                                />
                                <label htmlFor="username">Username</label>
                            </div>
                            <div className="form-floating">
                                <input type="password"
                                       className="form-control"
                                       id="password"
                                       name="password"
                                       value={password}
                                       onChange={handleChangePassword}
                                       placeholder="Password"/>
                                <label htmlFor="password">Password...</label>
                            </div>
                            <br/>
                            {message && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {message}
                                    </div>
                                </div>
                            )}
                            <br/>
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-lg login-btn">Login</button>
                            </div>
                        </form>
                        <br/>
                        <h5 className="text-center">Don't have an account? <Link to="/register"><i>Create here</i></Link></h5>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Login;