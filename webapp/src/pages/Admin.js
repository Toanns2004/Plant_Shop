import AdminSideBar from "../components/AdminSideBar";
import {Route, Routes, useNavigate} from "react-router-dom";
import ViewUsers from "../views/ViewUsers";
import AddNewUser from "../forms/AddNewUser";
import '../assets/css/admin.css'
import ViewCategories from "../views/ViewCategories";
import AddNewCategory from "../forms/AddNewCategory";
import ViewProducts from "../views/ViewProducts";
import AddNewProduct from "../forms/AddNewProduct";
import UserUpdate from "../forms/UserUpdate";
import UserDetails from "../views/UserDetails";
import EditUser from "../forms/EditUser";
import CategoryDetails from "../views/CategoryDetails";
import EditCategory from "../forms/EditCategory";
import ProductDetails from "../views/ProductDetails";
import EditProduct from "../forms/EditProduct";
import ViewOrder from "../views/ViewOrder";
import OrderDetails from "../views/OrderDetails";
import UserInfor from "./UserInfor";


const Admin = () => {

    return(
        <div className="container">
            <div className="row">
                <div className="col-3">
                    <AdminSideBar/>
                </div>
                <div className="col-9">
                    <div className="admin-content">
                        <Routes>
                            <Route path="/" element={<UserInfor/>}/>
                            <Route path="/userupdate" element={<UserUpdate/>}/>

                            <Route path="/viewusers" element={<ViewUsers/>}/>
                            <Route path="/adduser" element={<AddNewUser/>}/>
                            <Route path="/viewusers/:id" element={<UserDetails/>}/>
                            <Route path="/edituser/:id" element={<EditUser/>}/>

                            <Route path="/viewcategories" element={<ViewCategories/>}/>
                            <Route path="/addcategory" element={<AddNewCategory/>}/>
                            <Route path="/viewcategories/:id" element={<CategoryDetails/>}/>
                            <Route path="/editcategory/:id" element={<EditCategory/>}/>

                            <Route path="/viewproducts" element={<ViewProducts/>}/>
                            <Route path="/addproduct" element={<AddNewProduct/>}/>
                            <Route path="/viewproducts/:id" element={<ProductDetails/>}/>
                            <Route path="/editproduct/:id" element={<EditProduct/>}/>

                            <Route path="/vieworders" element={<ViewOrder/>}/>
                            <Route path="/vieworders/:id" element={<OrderDetails/>}/>

                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Admin;