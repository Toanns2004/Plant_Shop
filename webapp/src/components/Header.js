import '../assets/css/header.css';
import {Link, useNavigate} from "react-router-dom";
import logo from "../assets/images/logo.png";
import authService from "../services/auth-service";
import {useEffect, useState} from "react";
import authEventEmitter from "../services/authEvents";
import cartService from "../services/cart-service";
import SearchProduct from "./SearchProduct";
const Header = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [carts, setCarts] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [authEventTrigger, setAuthEventTrigger] = useState(0);

    const calcItemsAndAmount = (cartItems) => {
        let itemCount = 0;
        let itemAmount = 0;
        for (const item of cartItems) {
            itemCount += item.quantity;
            itemAmount += item.product.price * item.quantity;
        }
        return { totalItems: itemCount, totalAmount: itemAmount };
    };
    const updateCart = (id, token) => {
        const getAxiosConfig = {
            headers: {
                Authorization: "Bearer " + token,
            },
            credentials: "true",
        };

        cartService.getCartItemsOfUser(id, getAxiosConfig)
            .then((res) => {
                setCarts(res.data);
                const { totalItems, totalAmount } = calcItemsAndAmount(res.data);
                setTotalItems(totalItems);
                setTotalAmount(totalAmount);
            })
            .catch((error) => {
                console.error('Error fetching cart items: ', error);
            });
    };

    useEffect(() => {
        const user = authService.getCurrentUser();
        // console.log(user.id)
        if(user){
            setCurrentUser(user);
            updateCart(user.id, user.token)
        }

        const loginSuccessHandler = () => {
            const updatedUser = authService.getCurrentUser();
            if (updatedUser) {
                setCurrentUser(updatedUser);
                updateCart(updatedUser.id, updatedUser.token)
            }
            setAuthEventTrigger(prevTrigger => prevTrigger + 1);
        };

        authEventEmitter.on("loginSuccess", loginSuccessHandler);
        const cartChangeHandle = () => {
            const user = authService.getCurrentUser();
            if(user){
                updateCart(user.id, user.token);
                setAuthEventTrigger(prevTrigger => prevTrigger + 1);
            }
        };
        authEventEmitter.on("addCartSuccess", cartChangeHandle);
        authEventEmitter.on("deleteCardSuccess", cartChangeHandle);
        authEventEmitter.on("cartQtyChanged", cartChangeHandle);
        authEventEmitter.on("checkOutSuccess", cartChangeHandle);


        return () => {
            authEventEmitter.off("loginSuccess", loginSuccessHandler);
            authEventEmitter.off("addCartSuccess", cartChangeHandle);
            authEventEmitter.off("deleteCardSuccess", cartChangeHandle);
            authEventEmitter.off("checkOutSuccess", cartChangeHandle);
            authEventEmitter.off("cartQtyChanged", cartChangeHandle);
        }
    },[authEventEmitter])

    const handleLogout = () => {
        authService.logout();
        setCurrentUser(undefined);
        setCarts([]);
        setTotalAmount(0);
        setTotalItems(0);
        navigate("/login");
    }
    const handleCartClick = () => {
        if(currentUser){
            navigate(`/cart/${currentUser.id}`)
        }else {
            navigate("/login")
        }
    }

    return(
        <>
            <div className="header-top">
                <div className="container">
                    <div className="row">
                        <div className="header-info">
                            <div className="header-contact col">
                                Call us toll free: <span className="text-dark">+84-988 888 888</span>
                            </div>
                            <div className="header-contact col text-end">
                                Send us an email:
                                <span
                                    className="text-dark">bussiness@tinyseeds.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="header-mid">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <img src={logo} alt="" className="img-fluid"/>
                        </div>
                        <SearchProduct/>
                        <div className="col">
                            <div className="header-cart" onClick={handleCartClick}>
                                <div className="hm-minicart-trigger">
                                    <span className="item-icon"></span>
                                    <span className="item-text">{totalAmount}$
                                    <span className="cart-item-count">{totalItems}</span>
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="header-bottom ">
                <div className="container hb-nav">
                    <div className="row">
                        <div className="col-auto hb-menu nav-item">
                            <nav>
                                <ul>
                                    <li className="megamenu-holder">
                                        <Link to={''}><button className="btn btn-lg">Home</button></Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-auto hb-menu nav-item">
                            <nav>
                                <ul>
                                    <li className="megamenu-holder">
                                        <Link to={''} onClick={(e) => e.preventDefault()}><button className="btn btn-lg">Plants</button></Link>
                                        <ul className="megamenu hb-megamenu">
                                            <li>
                                                <Link to="/category/flowering">
                                                    <img src="/icons/flowering.png" alt="" width="200"/>
                                                </Link>
                                                <div className="text-center sub-menu">
                                                    <Link to="/category/flowering">Flowering</Link>
                                                </div>
                                            </li>
                                            <li>
                                                <Link to="/category/indoor">
                                                    <img src="/icons/indoor.png" alt="" width="200"/>
                                                </Link>
                                                <div className="text-center sub-menu">
                                                    <Link to="/category/indoor">Indoor Plants</Link>
                                                </div>
                                            </li>
                                            <li>
                                                <Link to="/category/outdoor">
                                                    <img src="/icons/outdoor.png" alt="" width="200"/>
                                                </Link>
                                                <div className="text-center sub-menu">
                                                    <Link to="/category/outdoor">Outdoor Plants</Link>
                                                </div>
                                            </li>
                                            <li>
                                                <Link to="/category/gift">
                                                    <img src="/icons/gift.png" alt="" width="200"/>
                                                </Link>
                                                <div className="text-center sub-menu">
                                                    <Link to="/category/gift">Gifts</Link>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-auto hb-menu nav-item">
                            <nav>
                                <ul>
                                    <li className="catmenu-dropdown megamenu-holder">
                                        <Link to={''} onClick={(e) => e.preventDefault()}><button className="btn btn-lg">Accessories</button></Link>
                                        <ul className="megamenu hb-megamenu">
                                            <li>
                                                <Link to="/category/pot">
                                                    <img src="/icons/pots.png" alt="" width="200"/>
                                                </Link>
                                                <div className="text-center sub-menu">
                                                    <Link to="/category/pot">Pots</Link>
                                                </div>
                                            </li>
                                            <li>
                                                <Link to="/category/supplies">
                                                    <img src="/icons/supplies.png" alt="" width="200"/>
                                                </Link>
                                                <div className="text-center sub-menu">
                                                    <Link to="/category/supplies">Supplies</Link>
                                                </div>
                                            </li>
                                            <li>
                                                <Link to="/category/accessories">
                                                    <img src="/icons/accessories.png" alt="" width="200"/>
                                                </Link>
                                                <div className="text-center sub-menu">
                                                    <Link to="/category/accessories">Accessories</Link>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-auto hb-menu nav-item">
                            <nav>
                                <ul>
                                    <li className="megamenu-holder">
                                        <Link to={''}><button className="btn btn-lg">Blogs</button></Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-auto hb-menu nav-item">
                            <nav>
                                <ul>
                                    <li className="megamenu-holder">
                                        <Link to="contact"><button className="btn btn-lg">Contact</button></Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-auto hb-menu nav-item">
                            <nav>
                                <ul>
                                    <li className="megamenu-holder">
                                        <Link to="/aboutus"><button className="btn btn-lg">About Us</button></Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col nav-item"></div>
                        <div className="col nav-item text-end">
                            {currentUser ? ( currentUser.role ==="admin" ? (
                                    <div>
                                        <Link to={"/admin"}>
                                            <button className="btn btn-lg">Hello, {currentUser.username}</button>
                                        </Link>
                                        <button className="btn btn-lg" onClick={handleLogout}>Log Out <i className="bi bi-box-arrow-right"></i></button>
                                    </div>
                                ):(
                                    <div>
                                        <Link to={"/info"}>
                                            <button className="btn btn-lg">Hello, {currentUser.username}</button>
                                        </Link>
                                        <button className="btn btn-lg" onClick={handleLogout}>Log Out <i className="bi bi-box-arrow-right"></i></button>
                                    </div>
                                )
                            ) : (
                                <Link to={'/login'}><button className="btn btn-lg">Login <i
                                    className="bi bi-box-arrow-in-right"></i></button></Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Header;