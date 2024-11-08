import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import categoryService from "../services/category-service";
import Swal from "sweetalert2";
import productService from "../services/product-service";


const AddNewProduct = () => {
    const navigate = useNavigate();
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState([]);
    const [categories, setCategories] = useState([]);

    const nameRef = useRef(null);
    const [message, setMessage] = useState("");

    const [productName, setProductName] = useState('');
    const [catId, setCatId] = useState();
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState();
    const [available, setAvailable] = useState();


    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
            'Content-Type': 'multipart/form-data',
        },
        credentials: "true"
    }

    const onChangeProductName = (e) => {
        setProductName(e.target.value);
    }


    const onChangeDescription = (e) => {
        setDescription(e.target.value);
    }

    const onChangePrice = (e) => {
        setPrice(e.target.value);
    }

    const onChangeAvailable = (e) => {
        setAvailable(e.target.value);
    }


    const handleThumbnailChange = (e) => {
        const files = Array.from(e.target.files);

        const thumbnailFiles = files.filter(file => file.type.startsWith('image'));

        setSelectedThumbnail(thumbnailFiles);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const imageFiles = files.filter(file => file.type.startsWith('image'));

        setSelectedImages(imageFiles);
    };

    useEffect(() => {
        categoryService.getAllCategories()
            .then(res => {
                setCategories(res.data)
            })
            .catch(error => {
                console.error("Get categories error: ", error)
            })
    }, [])

    const handleCreateProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("product_name", productName);
        formData.append("cat_id", catId);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("available", available);

        if (selectedThumbnail && selectedThumbnail.length > 0) {
            formData.append("thumbnail", selectedThumbnail[0]);
        }

        if (selectedImages && selectedImages.length > 0) {
            selectedImages.forEach((image, index) => {
                formData.append("images", image);
            });
        } else {
            console.log("selectedImages is null or empty");
        }
        console.log(formData)
        productService.createProduct(formData, axiosConfig)
            .then((response) => {
                setMessage("Success!");
                Swal.fire({
                    title: 'Success',
                    text: 'Add new Product successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok!',
                    confirmButtonColor: '#5ba515'
                });
                navigate("/admin/viewproducts");
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
        <div className="add-form">
            <h2>Add New Product:</h2>
            <form onSubmit={handleCreateProduct} encType="multipart/form-data">
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="name@example.com"
                        name="productName"
                        value={productName}
                        onChange={onChangeProductName}
                        ref={nameRef}
                    />
                    <label htmlFor="name">Product Name</label>
                </div>
                <select className="form-select" aria-label="Default select example" value={catId} onChange={(e) => setCatId(e.target.value)}>
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category.cat_id} value={category.cat_id}>{category.cat_name}</option>
                    ))}
                </select>
                <br/>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="description"
                        placeholder="name@example.com"
                        name="description"
                        value={description}
                        onChange={onChangeDescription}
                    />
                    <label htmlFor="description">Description</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="price"
                        placeholder="name@example.com"
                        name="price"
                        value={price}
                        onChange={onChangePrice}
                    />
                    <label htmlFor="price">Price</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="available"
                        placeholder="name@example.com"
                        name="available"
                        value={available}
                        onChange={onChangeAvailable}
                    />
                    <label htmlFor="available">Available</label>
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Choose Product's Thumbnail</span>
                    <input type="file"
                           className="form-control"
                           placeholder="images"
                           aria-label="images"
                           aria-describedby="basic-addon1"
                           name="thumbnail"
                           onChange={handleThumbnailChange}
                    />
                </div>
                <div className="preview-images">
                    {selectedThumbnail && selectedThumbnail.map((image, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            className="preview-image"
                            width="18%"
                            style={{ margin: '5px', border: 'solid 1px #5ba515' }}
                        />
                    ))}
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon2">Choose Product's Images</span>
                    <input type="file"
                           className="form-control"
                           placeholder="thumbnail"
                           aria-label="images"
                           aria-describedby="basic-addon2"
                           multiple
                           name="images"
                           onChange={handleImageChange}
                    />
                </div>
                <div className="preview-images">
                    {selectedImages && selectedImages.map((image, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            className="preview-image"
                            width="18%"
                            style={{ margin: '5px', border: 'solid 1px #5ba515' }}
                        />
                    ))}
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
                    <button className="btn add-btn"><i className="bi bi-plus-lg"></i> Add</button>
                    <Link to="/admin/viewproducts">
                        <button className="btn btn-danger"><i className="bi bi-x-lg"></i> Cancel</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
export default AddNewProduct;