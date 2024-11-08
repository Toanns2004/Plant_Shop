import CategorySideBar from "../components/CategorySideBar";
import '../assets/css/category.css'
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import categoryService from "../services/category-service";
import cartService from "../services/cart-service";
import Swal from "sweetalert2";
import authEventEmitter from "../services/authEvents";


const Category = () => {
    const navigate = useNavigate();
    const IMG_URL = "http://localhost:8080/images/";
    const {prefix} =useParams();

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user?.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState({});
    const [sortType, setSortType] = useState("none");

    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentProducts = products.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleNextPage = () => {
        if (currentPage < Math.ceil(products.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const sortProducts = (products, sortType) => {
        if (sortType === "asc") {
            return products.slice().sort((a, b) => a.price - b.price);
        } else if (sortType === "desc") {
            return products.slice().sort((a, b) => b.price - a.price);
        } else {
            return products;
        }
    };

    useEffect(() => {
        categoryService.getProductsByCategoryPrefix(prefix)
            .then(res => {
                setProducts(res.data)

            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
        categoryService.categoryByPrefix(prefix)
            .then(res => {
                setCategory(res.data)
            })
            .catch(error => {
                console.error("Error fetching category:", error);
            });
    }, [prefix])
    console.log(prefix)
    const quickAdd = (productId) => {
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
        <div className="category-page">
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        <CategorySideBar/>
                    </div>
                    <div className="col-9 cat-content">
                        <h2>{category.cat_name}</h2>
                        <hr/>
                        <div className="content-hd">
                            <div className="d-flex justify-content-end align-items-center">
                                <span className="d-inline-block align-middle">Sort by:</span>
                                <div className="col-3">
                                    <select className="form-select " aria-label="Default select example" onChange={(e) => {setSortType(e.target.value)}}>
                                        <option value="none" selected>None</option>
                                        <option value="asc">Price low to high</option>
                                        <option value="desc">Price high to low</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {sortProducts(currentProducts, sortType).map(product => (
                                <div className="col-4" key={product.product_id}>
                                    <div className="card">
                                        <a href={`/products/${product.product_id}`}>
                                            <img src={IMG_URL+product.thumbnail} alt="" className="card-img-top"/>
                                        </a>
                                        <div className="card-body">
                                            <div className="card-title">
                                                <a href={`/products/${product.product_id}`}>
                                                    <h4>{product.product_name}</h4>
                                                </a>
                                                <h5><i>Price: {product.price} $</i></h5>
                                                <div className="add-cart" onClick={() => {quickAdd(product.product_id)}}>
                                                    <h5>Add to cart <i className="bi bi-bag-plus-fill"></i></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <ul className="pagination float-end">
                                <li className="page-item">
                                    <a className="page-link" href="#" aria-label="Previous" onClick={handlePreviousPage}>
                                        <span aria-hidden="true">&laquo;</span>
                                    </a>
                                </li>
                                {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, index) => (
                                    <li key={index} className={currentPage === index + 1 ? 'active' : ''}>
                                        <li className="page-item">
                                            <a className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</a>
                                        </li>
                                    </li>
                                ))}
                                <li className="page-item">
                                    <a className="page-link" href="#" aria-label="Next" onClick={handleNextPage}>
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Category;