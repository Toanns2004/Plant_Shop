 import '../assets/css/cart.css';
 import {useEffect, useState} from "react";
 import {Link, useParams} from "react-router-dom";
 import cartService from "../services/cart-service";
 import productService from "../services/product-service";
 import Swal from "sweetalert2";
 import authEventEmitter from "../services/authEvents";

const ShoppingCart = () => {
    const {id} = useParams();
    const IMG_URL = "http://localhost:8080/images/";

    const [carts, setCarts] = useState([]);
    const [products, setProducts] = useState([]);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const upQty = (index) => {
        const cartItem = carts[index];
        const maxItemQty = cartItem.product.available;
        const currentQty = cartItem.quantity;
        if(currentQty < maxItemQty){
            const newQty = currentQty + 1;
            cartService.updateCartItemQty(cartItem.cart_id, {newQty}, axiosConfig)
                .then((res) => {
                    authEventEmitter.emit("cartQtyChanged");
                })
                .catch((error) => {
                    console.error('Error updating cart item qty: ', error);
                })
        }
    }

    const downQty = (index) => {
        const cartItem = carts[index];
        const currentQty = cartItem.quantity;
        if(currentQty > 1) {
            const newQty = currentQty - 1;
            cartService.updateCartItemQty(cartItem.cart_id, {newQty}, axiosConfig)
                .then((res) => {
                    authEventEmitter.emit("cartQtyChanged");
                })
                .catch((error) => {
                    console.error('Error updating cart item qty: ', error);
                })
        }
        // const updatedCarts = [...carts];
        // if (updatedCarts[index].quantity > 1) {
        //     updatedCarts[index].quantity -= 1;
        //     setCarts(updatedCarts);
        // }
    }

    const handleDeleteItem = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Product will be removed from your shopping cart!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5ba515',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if(result.isConfirmed){
                cartService.deleteCartItem(id, axiosConfig)
                    .then(response => {
                        setCarts(carts.filter((deletedCart)=> deletedCart.cart_id !== id));
                        Swal.fire({
                            title: 'Delete Successfully!',
                            text: 'Product removed!',
                            icon: 'success',
                            confirmButtonColor: '#5ba515'
                        });
                        authEventEmitter.emit("deleteCardSuccess");
                    })
                    .catch((error) => {
                        console.error(`Error deleting product with ID ${id}:`, error);
                        Swal.fire({
                            title: 'Delete error!',
                            text: 'An error occurred while deleting product!',
                            icon: 'error',
                            confirmButtonColor: '#dc3545'
                        });
                    });
            }
        })
    }
    const handleDeleteAllCart = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "All products will be removed from your shopping cart!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5ba515',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes, delete all!'
        }).then((result) => {
            if(result.isConfirmed){
                cartService.deleteAllCartItem(id, axiosConfig)
                    .then(response => {
                        setCarts([]);
                        Swal.fire({
                            title: 'Delete Successfully!',
                            text: 'All products removed!',
                            icon: 'success',
                            confirmButtonColor: '#5ba515'
                        });
                        authEventEmitter.emit("deleteCardSuccess");
                    })
                    .catch((error) => {
                        console.error(`Error deleting products with ID ${id}:`, error);
                        Swal.fire({
                            title: 'Delete error!',
                            text: 'An error occurred while deleting products!',
                            icon: 'error',
                            confirmButtonColor: '#dc3545'
                        });
                    });
            }
        })
    }
    useEffect(() => {
        cartService.getCartItemsOfUser(id, axiosConfig)
            .then(response => {
                setCarts(response.data);
                const cartProductPromises = response.data.map((cartItem) => {
                    return productService.getProductDetails(cartItem.product.product_id, axiosConfig)
                })
                Promise.all(cartProductPromises)
                    .then(productRes => {
                        setProducts(productRes.map((res) => res.data))
                    })
                    .catch((error) => {
                        console.error('Error fetching product details: ', error);
                    });
            })
            .catch((error) => {
                console.error('Error fetching cart items: ', error);
            });
        const updateCartData = () => {
            cartService.getCartItemsOfUser(id, axiosConfig)
                .then(response => {
                    setCarts(response.data);
                    const cartProductPromises = response.data.map((cartItem) => {
                        return productService.getProductDetails(cartItem.product.product_id, axiosConfig)
                    })
                    Promise.all(cartProductPromises)
                        .then(productRes => {
                            setProducts(productRes.map((res) => res.data))
                        })
                        .catch((error) => {
                            console.error('Error fetching product details: ', error);
                        });
                })
                .catch((error) => {
                    console.error('Error fetching cart items: ', error);
                });
        };

        authEventEmitter.on("deleteCardSuccess", updateCartData);
        authEventEmitter.on("cartQtyChanged", updateCartData);

        return () => {
            authEventEmitter.off("deleteCardSuccess", updateCartData);
            authEventEmitter.off("cartQtyChanged", updateCartData);
        };

    },[authEventEmitter])


    const totalItem = carts.reduce((totalQty, cartItem) => {
        const productQty = cartItem.quantity;
        return totalQty + productQty;
    }, 0)
    const totalAmount = carts.reduce((totalAmount, cartItem) => {
        const productTotal = cartItem.quantity * cartItem.product.price;
        return totalAmount + productTotal;
    }, 0)




    return(
        <div className="container cart-page vh-100">
            <div className="cart-header">
                <div className="row">
                    <div className="col-2 cart-hd-item">
                        <h5>Image</h5>
                    </div>
                    <div className="col-4 cart-hd-item">
                        <h5>Product</h5>
                    </div>
                    <div className="col-2 cart-hd-item">
                        <h5>Price</h5>
                    </div>
                    <div className="col-1 cart-hd-item">
                        <h5>Quantity</h5>
                    </div>
                    <div className="col-2 cart-hd-item">
                        <h5>Total</h5>
                    </div>
                    <div className="col-1 cart-hd-item">
                        <h5>Remove</h5>
                    </div>
                </div>
                <br/>
            </div>
            {carts.length === 0 ? (
                <div className="cart-item">
                    <h4 className="cart-desc">No product found!</h4>
                </div>
            ): (
                carts.map((cart, index) => (
                        <div className="cart-item" key={index}>
                            <div className="row">
                                <div className="col-2 cart-img">
                                    <img src={IMG_URL + products[index]?.thumbnail} alt="" className="img-fluid"/>
                                </div>
                                <div className="col-4 cart-desc">
                                    <Link to={`/products/${products[index]?.product_id}`}><h5>{products[index]?.product_name}</h5></Link>
                                </div>
                                <div className="col-2 cart-price">
                                    {products[index]?.price}$
                                </div>
                                <div className="col-1 cart-qty">
                                    <div className="cart-plus-minus">
                                        <input className="cart-plus-minus-box" value={cart.quantity} type="text"/>
                                        <div className="dec qtybutton" onClick={() => {downQty(index)}}><i className="bi bi-chevron-down"></i>
                                        </div>
                                        <div className="inc qtybutton" onClick={() => {upQty(index)}}><i className="bi bi-chevron-up"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-2 cart-total">
                                    {cart.quantity * products[index]?.price}$ in total
                                </div>
                                <div className="col-1 cart-remove">
                                    <button type="button" className=" cart-remove-btn" onClick={() => {handleDeleteItem(cart.cart_id)}}><i className="bi bi-x"></i></button>
                                </div>
                            </div>
                        </div>
                    ))
            )}
            <br/>
            <div className="row">
                <div className="col-5 cart-total">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col"><h3>Cart Total:</h3></th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row"><h5>1. Total Items</h5></th>
                            <th scope="row"><h5 className="text-end">{totalItem}</h5></th>
                        </tr>
                        <tr>
                            <th scope="row"><h5>2. Total Amount</h5></th>
                            <th scope="row"><h5 className="text-end">{totalAmount}$</h5></th>
                        </tr>
                        </tbody>
                    </table>
                    <div className="text-end">
                    </div>
                </div>
                <div className="col-7">
                    <div className="cart-option">
                        <button type="button" className="cart-delete-btn" onClick={() => handleDeleteAllCart(user.id)}>
                            Clear Cart <i className="bi bi-x-circle"></i>
                        </button>
                        <Link to="/checkout">
                            <button type="button" className="cart-checkout-btn">
                                Progress to Check Out <i className="bi bi-cash-stack"></i>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCart;