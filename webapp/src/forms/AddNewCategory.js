import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Swal from "sweetalert2";
import categoryService from "../services/category-service";

const AddNewCategory = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const prefixRef = useRef(null);

    const [prefix, setPrefix] = useState('');
    const [catName, setCatName] = useState('');
    const [description, setDescription] = useState('');

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const onChangePrefix = (e) => {
        setPrefix(e.target.value);
    }

    const onChangeCatName = (e) => {
        setCatName(e.target.value);
    }

    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }

    const handleCreateCategory = (e) => {
        e.preventDefault();
        categoryService.createCategory(prefix, catName, description, axiosConfig)
            .then((response) => {
                setMessage("Success!");
                Swal.fire({
                    title: 'Success',
                    text: 'Add new Category successfully!',
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

    useEffect(() => {
        prefixRef.current.focus();
    }, [])

    return(
        <div className="add-form vh-100">
            <h2>Add New Category:</h2>
            <form onSubmit={handleCreateCategory}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="prefix"
                        placeholder="name@example.com"
                        name="prefix"
                        value={prefix}
                        onChange={onChangePrefix}
                        ref={prefixRef}
                    />
                    <label htmlFor="prefix">Category Prefix</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="cat_name"
                        placeholder="name@example.com"
                        name="catName"
                        value={catName}
                        onChange={onChangeCatName}
                    />
                    <label htmlFor="cat_name">Category Name</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text"
                           className="form-control"
                           id="description"
                           placeholder="name@example.com"
                           name="description"
                           value={description}
                           onChange={onChangeDescription}
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
                    <button type="submit" className="btn add-btn"><i className="bi bi-plus-lg"></i> Add</button>
                    <Link to="/admin/viewcategories">
                        <button className="btn btn-danger"><i className="bi bi-x-lg"></i> Cancel</button>
                    </Link>
                </div>

            </form>
        </div>
    )
}
export default AddNewCategory;