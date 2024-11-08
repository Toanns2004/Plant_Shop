import {useEffect, useState} from "react";
import "../assets/css/product.css";
import productService from "../services/product-service";
import {useNavigate, useParams} from "react-router-dom";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import cartService from "../services/cart-service";
import Swal from "sweetalert2";
import authEventEmitter from "../services/authEvents";


const Product = () => {
    const {id} = useParams();
    const IMG_URL = "http://localhost:8080/images/";
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('');
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);

    const [relatedProducts, setRelatedProducts] = useState([]);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    useEffect(() => {
        productService.getProductDetails(id).then(res => {
            const getProduct = res.data;
            setProduct(getProduct)
            if (getProduct.category && getProduct.category.cat_id) {
                console.log(getProduct.category.cat_id)
                productService.getRelatedProducts(getProduct.category.cat_id)
                    .then(res => {
                        setRelatedProducts(res.data)
                    })
                    .catch(error => {
                        console.error('Error fetching related products:', error);
                    });
            }else {
                console.log("loi cmnr")
            }
        });
        productService.getProductImages(id).then(res => {
            setImages(res.data);
            setSelectedImage(res.data[0]);
        });


    }, [])

    const upQty = () => {
        if(quantity < product.available){
            setQuantity(quantity + 1);
        }
    }
    const downQty = () => {
        if(quantity > 1){
            setQuantity(quantity - 1)
        }
    }

    const handleAddToCart = (e) => {
        e.preventDefault();
        if(user){
            cartService.addToCart(user.id, product.product_id, quantity, axiosConfig)
                .then((response) => {
                    Swal.fire({
                        title: 'Success',
                        text: 'Add to cart successfully!',
                        icon: 'success',
                        confirmButtonText: 'Ok!',
                        confirmButtonColor: '#5ba515'
                    });
                    authEventEmitter.emit("addCartSuccess");
                })
                .catch((error) => {
                    const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                });
        }else {
            navigate("/login");
        }

    }
    const quickAdd = (productId) =>{
        cartService.addToCart(user.id, productId, 1, axiosConfig)
            .then((response) => {
                Swal.fire({
                    title: 'Success',
                    text: 'Add to cart successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok!',
                    confirmButtonColor: '#5ba515'
                });
                authEventEmitter.emit("addCartSuccess");
            })
            .catch((error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            });
    }
    return(
        <div className="container product-page">
            <div className="row">
                <div className="col-5">
                    <div className="img-part">
                        <div className="lg-img">
                            <img src={IMG_URL+selectedImage.img_name} alt="" className="img-fluid"/>
                        </div>
                        <div className="sm-img">
                            <OwlCarousel
                                className='owl-theme'
                                items={4}
                                nav={false}
                                autoplay={true}
                                loop={true}
                                autoplayTimeout={3000}
                                dots={false}
                                >
                                {images.map(image => (
                                    <div key={image.img_id} className='item'>
                                        <img src={IMG_URL+image.img_name} className="d-block w-100" alt="..." onClick={() => setSelectedImage(image)}/>
                                    </div>
                                ))}
                            </OwlCarousel>
                        </div>
                    </div>
                </div>

                <div className="col-7 product-detail">
                    <h2>{product.product_name}</h2>
                    <h5><i>Category: {product.category && (product.category.cat_name)}</i></h5>
                    <h4>Price: {product.price} $</h4>
                    <h5>Available: {product.available}</h5>
                    <form onSubmit={handleAddToCart} className="cart-quantity">
                        <div className="quantity">
                            <label>Quantity</label>
                            <div className="cart-plus-minus">
                                <input className="cart-plus-minus-box" value={quantity} type="text"/>
                                    <div className="dec qtybutton" onClick={downQty}><i className="bi bi-chevron-down"></i></div>
                                    <div className="inc qtybutton" onClick={upQty}><i className="bi bi-chevron-up"></i></div>
                            </div>
                        </div>
                        <button className="add-to-cart" type="submit">Add to cart <i
                            className="bi bi-bag-plus-fill"></i></button>
                    </form>

                    <p>{product.description}</p>
                </div>
            </div>
            <br/>
            <div className="product-relate">
                <h4>Related Product: </h4>
                <br/>
                <OwlCarousel
                    className='owl-theme'
                    items={5}
                    nav={false}
                    autoplay={true}
                    loop={true}
                    autoplayTimeout={4000}
                    dots={false}
                >
                    {relatedProducts.map(relatedProduct => (
                        <div className="card" key={relatedProduct.product_id}>
                            <a href={`/products/${relatedProduct.product_id}`}>
                                <img src={IMG_URL+relatedProduct.thumbnail} alt="" className="card-img-top"/>
                            </a>
                            <div className="card-body">
                                <div className="card-title">
                                    <a href={`/products/${relatedProduct.product_id}`}>
                                        <h4>{relatedProduct.product_name}</h4>
                                    </a>
                                    <h5><i>Price: {relatedProduct.price} $</i></h5>
                                    <div className="add-cart" onClick={() => {quickAdd(relatedProduct.product_id)}}>
                                        <h5>Add to cart <i
                                            className="bi bi-bag-plus-fill"></i></h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </OwlCarousel>
            </div>
        </div>

    )
}

export default Product;