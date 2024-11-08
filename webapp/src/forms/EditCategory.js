import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import userService from "../services/user-service";
import categoryService from "../services/category-service";
import UserService from "../services/user-service";
import Swal from "sweetalert2";


const EditCategory = () => {
    const navigate = useNavigate();
    const {id} = useParams();

    const [updateCat, setUpdateCat] = useState({
        prefix: '',
        cat_name: '',
        description: ''
    });

    const [message, setMessage] = useState("");
    const prefixRef = useRef(null);

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
        setUpdateCat(prevCat => ({
            ...prevCat, [name] : value
        }));
    }

    useEffect(() => {
        prefixRef.current.focus();
        categoryService.categoryDetails(id, axiosConfig)
            .then(response => {
                setUpdateCat(response.data)
            })
            .catch(error => {
                console.error("Get user details Error: ", error)
            })
    }, [id])

    const handleEditCategory = (e) => {
        e.preventDefault();
        const editCat = {
            ...updateCat,
        }
        categoryService.updateCategory(id, editCat.prefix, editCat.cat_name, editCat.description, axiosConfig)
            .then((response) => {
                setMessage("Update category successfully!");
                Swal.fire({
                    title: 'Success',
                    text: 'Category updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok!',
                    confirmButtonColor: '#5ba515'
                });
                navigate("/admin/viewcategories");
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
            <h2>Edit Category:</h2>
            <form onSubmit={handleEditCategory}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="prefix"
                        placeholder="name@example.com"
                        name="prefix"
                        value={updateCat.prefix}
                        onChange={onChange}
                        ref={prefixRef}
                        // disabled
                    />
                    <label htmlFor="prefix">Category Prefix</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="cat_name"
                        placeholder="name@example.com"
                        name="cat_name"
                        value={updateCat.cat_name}
                        onChange={onChange}
                    />
                    <label htmlFor="cat_name">Category Name</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text"
                           className="form-control"
                           id="description"
                           placeholder="name@example.com"
                           name="description"
                           value={updateCat.description}
                           onChange={onChange}
                    />
                    <label htmlFor="description">Description</label>
                </div>
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
                    <Link to="/admin/viewcategories">
                        <button className="btn btn-danger"><i className="bi bi-x-lg"></i> Cancel</button>
                    </Link>
                </div>

            </form>
        </div>
    )
}
export default EditCategory;