
import './App.css';
import {Navigate, Route, Routes, useParams} from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./forms/Login";
import Register from "./forms/Register";

import authService from "./services/auth-service";
import Admin from "./pages/Admin";
import Product from "./pages/Product";
import ProductCard from "./components/ProductCard";
import ShoppingCart from "./pages/ShoppingCart";
import SearchResults from "./pages/SearchResults";
import Checkout from "./pages/Checkout";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./forms/ContactUs";
import Category from "./pages/Category";
import UserInfor from "./pages/UserInfor";

function PrivateRoute({ element, roles }) {
    const currentUser = authService.getCurrentUser();
    const { id } = useParams();

    if (!currentUser) {
        // if not logged in
        return <Navigate to="/login" />;
    }

    if (!roles.includes(currentUser.role)) {
        // if not have role
        return <Navigate to="/" />;
    }

    if (id && currentUser.id !== parseInt(id)) {
        // if trying to access another user's cart
        return <Navigate to="/" />;
    }

    // if have role
    return element;
}


function App() {

  return (
    <>
        <Header/>
        <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route
                path="/admin/*"
                element={
                    <PrivateRoute roles={["admin"]} element={<Admin />} />
                }
            />
            <Route path="/products/:id" element={<Product/>}/>
            <Route path="/card" element={<ProductCard/>}/>
            <Route path="/cart/:id"
                   element={
                        <PrivateRoute roles={["user"]} element={<ShoppingCart/>}/>
                    }
            />
            <Route path="/search" element={<SearchResults/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
            <Route path="/aboutus" element={<AboutUs/>}/>
            <Route path="/contact" element={<ContactUs/>}/>
            <Route path="/category/:prefix" element={<Category/>}/>
            <Route path="/info" element={<UserInfor/>}/>
        </Routes>
        <Footer/>
    </>
  );
}

export default App;
