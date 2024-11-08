import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import productService from "../services/product-service";
import categoryService from "../services/category-service";
import Swal from "sweetalert2";


const EditProduct = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const IMG_URL = "http://localhost:8080/images/";
    const [productDetails, setProductDetails] = useState({});
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [catId, setCatId] = useState('');

    const nameRef = useRef(null);
    const [message, setMessage] = useState("");

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user.token;

    const [selectedImages, setSelectedImages] = useState([]);
    const [deleteImages, setDeleteImages] = useState([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState([]);


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
            'Content-Type': 'multipart/form-data',
        },
        credentials: "true"
    }

    const onChange = (e) => {
        const {name, value} = e.target;
        setProductDetails(prevProduct => ({
            ...prevProduct, [name] : value
        }));
    }

    useEffect(() => {
        nameRef.current.focus();
        productService.getProductDetails(id)
            .then(response => {
                setProductDetails(response.data)
            })
            .catch(error => {
                console.error("Get product details Error: ", error)
            });
        productService.getProductImages(id)
            .then(response => {
                setImages(response.data)
            })
            .catch(error => {
                console.error("Get product images Error: ", error)
            });
        categoryService.getAllCategories()
            .then(res => {
                setCategories(res.data)
            })
            .catch(error => {
                console.error("Get categories error: ", error)
            })
    }, [])

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


    const handleEditProduct = (e) => {
        e.preventDefault();
        console.log(catId);
        const formData = new FormData();
        formData.append("product_name", productDetails.product_name);
        formData.append("cat_id", catId);
        formData.append("description", productDetails.description);
        formData.append("price", productDetails.price);
        formData.append("available", productDetails.available);

        if (selectedThumbnail && selectedThumbnail.length > 0) {
            formData.append("thumbnail", selectedThumbnail[0]);
        }

        if (selectedImages && selectedImages.length > 0) {
            selectedImages.forEach((image, index) => {
                formData.append("newImages", image);
            });
        } else {
            console.log("selectedImages is null or empty");
        }

        formData.append("deleteImages", deleteImages);

        productService.updateProduct(id, formData, axiosConfig)
            .then((response) => {
                setMessage("Success!");
                Swal.fire({
                    title: 'Success',
                    text: 'Update Product successfully!',
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
    const handleDeleteImage = (id) => {
        const updatedImages = images.filter((image) => image.img_id !== id);
        setImages(updatedImages);
        setDeleteImages([...deleteImages, id]);
        // Swal.fire({
        //     title: 'Are you sure?',
        //     text: "Product will be removed from your products list!",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonColor: '#5ba515',
        //     cancelButtonColor: '#dc3545',
        //     confirmButtonText: 'Yes, delete it!'
        // }).then((result) => {
        //     if(result.isConfirmed){
        //         productService.deleteImageById(id)
        //             .then(() => {
        //                 const updatedImages = images.filter(image => image.img_id !== id);
        //                 setImages(updatedImages);
        //                 Swal.fire({
        //                     title: 'Delete Successfully!',
        //                     text: 'Image removed!',
        //                     icon: 'success',
        //                     confirmButtonColor: '#5ba515'
        //                 });
        //             })
        //             .catch(error => {
        //                 console.error('Error deleting image:', error);
        //             });
        //     }
        // })
    };
    return(
        <div className="add-form">
            <h2>Add New Product:</h2>
            <form onSubmit={handleEditProduct} encType="multipart/form-data">
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="productName"
                        placeholder="productName"
                        name="product_name"
                        value={productDetails.product_name}
                        onChange={onChange}
                        ref={nameRef}
                    />
                    <label htmlFor="productName">Product Name</label>
                </div>
                <select className="form-select" name="cat_id" aria-label="Default select example" value={productDetails.cat_id} onChange={(e) => setCatId(e.target.value)}>
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
                        placeholder="description"
                        name="description"
                        value={productDetails.description}
                        onChange={onChange}
                    />
                    <label htmlFor="description">Description</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="price"
                        placeholder="price"
                        name="price"
                        value={productDetails.price}
                        onChange={onChange}
                    />
                    <label htmlFor="price">Price</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="available"
                        placeholder="available"
                        name="available"
                        value={productDetails.available}
                        onChange={onChange}
                    />
                    <label htmlFor="available">Available</label>
                </div>
                <h4>Product thumbnail: </h4>
                <div className="col-3">
                    <img src={IMG_URL+productDetails.thumbnail} alt="" className="img-fluid"/>
                </div>
                <br/>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Change Product's Thumbnail</span>
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

                <div className="edit-img-container">
                    <h4>Product Images: </h4>
                    <div className="row">
                        {images.map((image) => (
                            <div key={image.img_id} className="col-3 edit-img">
                                <img src={IMG_URL+image.img_name} alt={image.altText} className="img-fluid"/>
                                <br/>
                                <div className="text-center">
                                    <button className="delete-btn" onClick={() => handleDeleteImage(image.img_id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon2">Add more product images: </span>
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
                    <button type="submit" className="btn add-btn"><i className="bi bi-pencil-square"></i> Update</button>
                    <Link to="/admin/viewproducts">
                        <button className="btn btn-danger"><i className="bi bi-x-lg"></i> Cancel</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default EditProduct;