import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import categoryService from "../services/category-service";
import Swal from "sweetalert2";
import userService from "../services/user-service";

const ViewCategories = () =>  {
    const [categories, setCategories] = useState([]);
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    useEffect(() => {
        categoryService.getAllCategories()
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("Get all categories Error: ", error)
            })
    }, [])

    const handleDeleteCategory = (cat_id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Category will be removed from your categories list!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5ba515',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if(result.isConfirmed){
                categoryService.deleteCategory(cat_id, axiosConfig)
                    .then(response => {
                        setCategories(categories.filter((deletedCategory)=> deletedCategory.cat_id !== cat_id));
                        Swal.fire({
                            title: 'Delete Successfully!',
                            text: 'Category removed!',
                            icon: 'success',
                            confirmButtonColor: '#5ba515'
                        });
                    })
                    .catch((error) => {
                        console.error(`Error deleting category with ID ${cat_id}:`, error);
                        Swal.fire({
                            title: 'Delete error!',
                            text: 'An error occurred while deleting category!',
                            icon: 'error',
                            confirmButtonColor: '#dc3545'
                        });
                    });
            }
        })
    }
    return(
        <div>
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col col-md-6"><b>View All Categories</b></div>
                        <div className="col col-md-6">
                            <Link to="/admin/addcategory">
                                <button className="btn add-btn float-end"><i className="bi bi-plus-lg"></i> Add New Category</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Category ID</th>
                            <th scope="col">Category Prefix</th>
                            <th scope="col">Category Name</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map(category => (
                            <tr key={category.cat_id}>
                                <th scope="row">{category.cat_id}</th>
                                <th scope="row">{category.prefix}</th>
                                <th scope="row">{category.cat_name}</th>
                                <td>
                                    <Link to={`./${category.cat_id}`}>
                                        <button className="btn detail-btn action-btn"><i
                                            className="bi bi-info-circle"></i> Details</button>
                                    </Link>
                                    <Link to={`/admin/editcategory/${category.cat_id}`}>
                                        <button className="btn edit-btn action-btn"><i
                                            className="bi bi-pencil-square"></i> Edit</button>
                                    </Link>
                                    <button className="btn delete-btn action-btn" onClick={() => {handleDeleteCategory(category.cat_id)}}>
                                        <i className="bi bi-trash3"></i> Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default ViewCategories;