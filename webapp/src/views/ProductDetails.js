import {useEffect, useState} from "react";
import productService from "../services/product-service";
import {Link, useParams} from "react-router-dom";


const ProductDetails = () => {
    const IMG_URL = "http://localhost:8080/images/";

    const [productDetails, setProductDetails] = useState({});
    const [productImages, setProductImages] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        productService.getProductDetails(id)
            .then(response => {
                setProductDetails(response.data);
            })
            .catch(error => {
                console.error("Get product details Error: ", error)
            });

        productService.getProductImages(id)
            .then(response => {
                setProductImages(response.data);
            })
            .catch(error => {
                console.error("Get product's images Error: ", error)
            });
    },[id])

    console.log(productDetails);
    return(
        <div>
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col col-md-6"><b>Product Details</b></div>
                        <div className="col col-md-6">

                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <label className="col-sm-2 col-label-form"><b>Product name</b></label>
                        <div className="col-sm-10">
                            {productDetails.product_name}
                        </div>
                    </div>
                    {productDetails.category && (
                        <div className="row mb-3">
                            <label className="col-sm-2 col-label-form"><b>Category</b></label>
                            <div className="col-sm-10">
                                {productDetails.category.cat_name}
                            </div>
                        </div>
                    )}
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Description</b></label>
                        <div className="col-sm-10">
                            {productDetails.description}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Price</b></label>
                        <div className="col-sm-10">
                            {productDetails.price} $
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Available</b></label>
                        <div className="col-sm-10">
                            {productDetails.available}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Thumbnail</b></label>
                        <div className="col-sm-10">
                            <img src={IMG_URL + productDetails.thumbnail} alt="" width={250}/>
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Images</b></label>
                        <div className="col-sm-10 d-flex flex-row">
                            {productImages.map(productImage => (
                                <div key={productImage.img_id} className="col-sm-2">
                                    <img src={IMG_URL + productImage.img_name} alt="" width= "100%"/>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to={`/admin/editproduct/${productDetails.product_id}`}>
                            <button className="btn edit-btn"><i className="bi bi-pencil-square"></i> Edit Product</button>
                        </Link>
                        <Link to="/admin/viewproducts">
                            <button className="btn add-btn"><i className="bi bi-tree"></i> View All Products</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProductDetails;