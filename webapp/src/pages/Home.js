
import '../assets/css/home.css'
import OwlCarousel from "react-owl-carousel";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import productService from "../services/product-service";
import cartService from "../services/cart-service";
import Swal from "sweetalert2";
import authEventEmitter from "../services/authEvents";
import categoryService from "../services/category-service";
const Home = () => {
    const IMG_URL = "http://localhost:8080/images/";
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const [newProducts, setNewProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        productService.getNewProducts()
            .then(res => {
                setNewProducts(res.data)
            })
            .catch(error => {
                console.error("Error fetching product:", error);
            });
        categoryService.getAllCategories()
            .then(res => {
                setCategories(res.data)
            })
            .catch(error => {
                console.error("Error fetching category:", error);
            });
    },[])

    console.log(newProducts);

    const quickAdd = (productId) =>{
        if(user){
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
        }else {
            navigate("/login");
        }

    }

    return(
        <div className="container">
            <div className="home-banner">
                <h1>Wellcome to TinySeeds</h1>
                <h3>Where Small Beginnings Blossom into Big Dreams!</h3>
            </div>
            <br/>
            <div className="text-center home-news">
                <h3>New Arrivals</h3>
                <OwlCarousel
                    id="news-carousel"
                    className='owl-theme'
                    items={5}
                    nav={false}
                    autoplay={true}
                    loop={true}
                    autoplayTimeout={2000}
                    dots={false}
                >
                    {newProducts.map(newProduct => (
                        <div className="card" key={newProduct.product_id}>
                            <a href={`/products/${newProduct.product_id}`}>
                                <img src={IMG_URL+newProduct.thumbnail} alt="" className="card-img-top"/>
                            </a>
                            <div className="card-body">
                                <div className="card-title">
                                    <a href={`/products/${newProduct.product_id}`}>
                                        <h4>{newProduct.product_name}</h4>
                                    </a>
                                    <h5><i>Price: {newProduct.price} $</i></h5>
                                    <div className="add-cart" onClick={() => {quickAdd(newProduct.product_id)}}>
                                        <h5>Add to cart <i
                                            className="bi bi-bag-plus-fill"></i></h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </OwlCarousel>
            </div>
            <br/>
            <div className="text-center home-promo">
                <h3>Hot Deals</h3>
                <div className="row">
                    <div className="col-8">
                        <OwlCarousel
                            id="deal-carousel"
                            className='owl-theme'
                            items={1}
                            nav={false}
                            autoplay={true}
                            loop={true}
                            autoplayTimeout={5000}
                            dots={false}
                        >
                            <div className="promo-banner">
                                <img src="/img/promo1.png" alt=""/>
                                <h5 className="promo-title">Create a green haven in your home with our Indoor Plants promotion!</h5>
                                <p className="promo-desc">Purchase any indoor plant, and we'll include a free decorative pot. Breathe fresh air and boost your mood with our selection of air-purifying indoor plants. Transform your space into a lush oasis today.</p>
                                <Link to="/category/flowering"><button className="promo-go">Shop now!</button></Link>

                            </div>
                            <div className="promo-banner">
                                <img src="/img/promo2.png" alt=""/>
                                <h5 className="promo-title">Join us for a Flowering Fiesta this month!</h5>
                                <p className="promo-desc">Enjoy a 20% discount on all flowering plants in our collection. From vibrant roses to elegant orchids, bring colors and fragrances to your home. Don't miss this chance to add natural beauty to your life.</p>
                                <Link to="/category/flowering"><button className="promo-go">Shop now!</button></Link>
                            </div>
                            <div className="promo-banner">
                                <img src="/img/promo3.png" alt=""/>
                                <h5 className="promo-title">Spread joy and positivity with our Gift Plants Galore event!</h5>
                                <p className="promo-desc">Choose from our curated collection of gift plants, perfect for special occasions or just to show someone you care. With every gift plant purchase, you'll receive a personalized message card for free. Share the gift of nature and love.</p>
                                <Link to="/category/flowering"><button className="promo-go">Shop now!</button></Link>
                            </div>
                        </OwlCarousel>
                    </div>
                    <div className="col-4">
                        <div className="promo-static">
                            <img src="/img/promo4.png" alt="" className="img-fluid"/>
                            <p className="promo-title">Explore our Pottery Paradise and find the perfect pots to complement your plants.</p>
                            <Link to="/category/pots"><button className="promo-go">Shop now!</button></Link>
                        </div>
                        <div className="promo-static">
                            <img src="/img/promo5.png" alt="" className="img-fluid"/>
                            <p className="promo-title">Enhance your gardening experience with our Accessories Extravaganza.</p>
                            <Link to="/category/accessories"><button className="promo-go">Shop now!</button></Link>
                        </div>
                    </div>

                </div>
            </div>
            <br/>
            <div className="text-center">
                <h3>Categories</h3>
                <OwlCarousel
                    id="cat-carousel"
                    className='owl-theme'
                    items={4}
                    nav={false}
                    autoplay={true}
                    loop={true}
                    autoplayTimeout={3000}
                    dots={false}
                >
                    {categories.map(category => (
                        <div key={category.cat_id} className="col home-cats">
                            <figure className="snip1256">
                                <img src={`/icons/${category.prefix}.png`} alt="sample42" className="img-fluid"/>
                                <figcaption>
                                    <h3>{category.cat_name}</h3>
                                    <br/>
                                    <br/>
                                    <br/>
                                    <Link to={`/category/${category.prefix}`} className="read-more">See all <i
                                        className="bi bi-chevron-right"></i></Link>
                                </figcaption>
                            </figure>
                            <div className="text-center cat-title"><h4>{category.cat_name}</h4></div>
                        </div>
                    ))}
                    {/*<div className="col home-cats">*/}
                    {/*    <figure className="snip1256">*/}
                    {/*        <img src={`/icons/flowering.png`} alt="sample42" className="img-fluid"/>*/}
                    {/*        <figcaption>*/}
                    {/*            <h3>Flowering</h3>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <Link to={`/category/flowering`} className="read-more">See all <i*/}
                    {/*                className="bi bi-chevron-right"></i></Link>*/}
                    {/*        </figcaption>*/}
                    {/*    </figure>*/}
                    {/*    <div className="text-center"><h4>Flowering</h4></div>*/}
                    {/*</div>*/}
                    {/*<div className="col home-cats">*/}
                    {/*    <figure className="snip1256">*/}
                    {/*        <img src={`/icons/indoor.png`} alt="sample42" className="img-fluid"/>*/}
                    {/*        <figcaption>*/}
                    {/*            <h3>Indoor Plants</h3>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <Link to={`/category/indoor`} className="read-more">See all <i*/}
                    {/*                className="bi bi-chevron-right"></i></Link>*/}
                    {/*        </figcaption>*/}
                    {/*    </figure>*/}
                    {/*    <div className="text-center"><h4>Indoor Plants</h4></div>*/}
                    {/*</div>*/}
                    {/*<div className="col home-cats">*/}
                    {/*    <figure className="snip1256">*/}
                    {/*        <img src={`/icons/outdoor.png`} alt="sample42" className="img-fluid"/>*/}
                    {/*        <figcaption>*/}
                    {/*            <h3>Outdoor Plants</h3>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <Link to={`/category/outdoor`} className="read-more">See all <i*/}
                    {/*                className="bi bi-chevron-right"></i></Link>*/}
                    {/*        </figcaption>*/}
                    {/*    </figure>*/}
                    {/*    <div className="text-center"><h4>Outdoor Plants</h4></div>*/}
                    {/*</div>*/}
                    {/*<div className="col home-cats">*/}
                    {/*    <figure className="snip1256">*/}
                    {/*        <img src={`/icons/gift.png`} alt="sample42" className="img-fluid"/>*/}
                    {/*        <figcaption>*/}
                    {/*            <h3>Gifts</h3>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <Link to={`/category/gift`} className="read-more">See all <i*/}
                    {/*                className="bi bi-chevron-right"></i></Link>*/}
                    {/*        </figcaption>*/}
                    {/*    </figure>*/}
                    {/*    <div className="text-center"><h4>Gifts</h4></div>*/}
                    {/*</div>*/}
                    {/*<div className="col home-cats">*/}
                    {/*    <figure className="snip1256">*/}
                    {/*        <img src={`/icons/pots.png`} alt="sample42" className="img-fluid"/>*/}
                    {/*        <figcaption>*/}
                    {/*            <h3>Pots</h3>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <Link to={`/category/pots`} className="read-more">See all <i*/}
                    {/*                className="bi bi-chevron-right"></i></Link>*/}
                    {/*        </figcaption>*/}
                    {/*    </figure>*/}
                    {/*    <div className="text-center"><h4>Pots</h4></div>*/}
                    {/*</div>*/}
                    {/*<div className="col home-cats">*/}
                    {/*    <figure className="snip1256">*/}
                    {/*        <img src={`/icons/supplies.png`} alt="sample42" className="img-fluid"/>*/}
                    {/*        <figcaption>*/}
                    {/*            <h3>Supplies</h3>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <Link to={`/category/supplies`} className="read-more">See all <i*/}
                    {/*                className="bi bi-chevron-right"></i></Link>*/}
                    {/*        </figcaption>*/}
                    {/*    </figure>*/}
                    {/*    <div className="text-center"><h4>Supplies</h4></div>*/}
                    {/*</div>*/}
                    {/*<div className="col home-cats">*/}
                    {/*    <figure className="snip1256">*/}
                    {/*        <img src={`/icons/accessories.png`} alt="sample42" className="img-fluid"/>*/}
                    {/*        <figcaption>*/}
                    {/*            <h3>Accessories</h3>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <br/>*/}
                    {/*            <Link to={`/category/accessories`} className="read-more">See all <i*/}
                    {/*                className="bi bi-chevron-right"></i></Link>*/}
                    {/*        </figcaption>*/}
                    {/*    </figure>*/}
                    {/*    <div className="text-center"><h4>Accessories</h4></div>*/}
                    {/*</div>*/}
                </OwlCarousel>
            </div>
            <br/>
            <br/>
            <div className="text-center">
                <h3>Our commitments</h3>
                <div className="footer-shipping pt-60 pb-55 pb-xs-25">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6 pb-sm-55 pb-xs-55">
                            <div className="li-shipping-inner-box">
                                <div className="shipping-icon">
                                    <img src="/icons/shipping.2.svg" alt="Shipping Icon"/>
                                </div>
                                <div className="shipping-text">
                                    <h2>Fast Delivery</h2>
                                    <p>And free returns. See checkout for delivery dates.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 pb-sm-55 pb-xs-55">
                            <div className="li-shipping-inner-box">
                                <div className="shipping-icon">
                                    <img src="/icons/pay-per-click.2.svg" alt="Shipping Icon"/>
                                </div>
                                <div className="shipping-text">
                                    <h2>Safe Payment</h2>
                                    <p>Pay with the world's most popular and secure payment methods.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 pb-xs-30">
                            <div className="li-shipping-inner-box">
                                <div className="shipping-icon">
                                    <img src="/icons/protection.2.svg" alt="Shipping Icon"/>
                                </div>
                                <div className="shipping-text">
                                    <h2>Shop with Confidence</h2>
                                    <p>Our Buyer Protection covers your purchasefrom click to delivery.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 pb-xs-30">
                            <div className="li-shipping-inner-box">
                                <div className="shipping-icon">
                                    <img src="/icons/information.2.svg" alt="Shipping Icon"/>
                                </div>
                                <div className="shipping-text">
                                    <h2>24/7 Help Center</h2>
                                    <p>Have a question? Call a Specialist or chat online.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
        </div>
    )
}
export default Home;