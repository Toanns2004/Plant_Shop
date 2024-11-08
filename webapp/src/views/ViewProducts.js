import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import productService from "../services/product-service";
import Swal from "sweetalert2";


const ViewProducts = () => {
    const IMG_URL = "http://localhost:8080/images/";

    const [products, setProducts] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentProducts = filteredProducts.slice(startIndex, endIndex);

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

    useEffect(() => {
        productService.getAllProducts()
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error("Get all categories Error: ", error)
            })
    }, [])
    useEffect(() => {
        const filteredProducts = products.filter((product) =>
            product.product_name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setCurrentPage(1);
        setFilteredProducts(filteredProducts);
    }, [searchValue, products]);

    const handleDeleteProduct = (product_id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Product will be removed from your products list!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5ba515',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if(result.isConfirmed){
                productService.deleteProduct(product_id, axiosConfig)
                    .then(response => {
                        setProducts(products.filter((deletedProduct)=> deletedProduct.product_id !== product_id));
                        Swal.fire({
                            title: 'Delete Successfully!',
                            text: 'Product removed!',
                            icon: 'success',
                            confirmButtonColor: '#5ba515'
                        });
                    })
                    .catch((error) => {
                        console.error(`Error deleting category with ID ${product_id}:`, error);
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

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    return(
        <div>
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6"><b>View All Products</b></div>
                        <div className="col-md-6 d-flex justify-content-end align-items-center">
                            <div className="col-md-7 d-flex align-items-center">
                                <div className="input-group mb-0 h-100">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Find product by name..."
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-5 d-flex align-items-center justify-content-end">
                                <Link to="/admin/addproduct">
                                    <button className="btn add-btn"><i className="bi bi-plus-lg"></i> Add New Product</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                        <tr>
                            <th className="text-center align-middle" scope="col-2">Thumbnail</th>
                            <th className=" align-middle" scope="col-3">Product Name</th>
                            <th className=" align-middle" scope="col-2">Category</th>
                            <th className="text-center align-middle" scope="col-1">Price</th>
                            <th className="text-center align-middle" scope="col-1">Available</th>
                            <th className="text-center align-middle" scope="col-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentProducts.map(product => (
                            <tr key={product.product_id}>
                                <td><img src={IMG_URL + product.thumbnail} width="75"/></td>
                                <td className="align-middle">{product.product_name}</td>
                                <td className=" align-middle">{product.category.cat_name}</td>
                                <td className=" align-middle">{product.price}$</td>
                                <td className=" align-middle">{product.available}</td>
                                <td className="text-center align-middle">
                                    <Link to={`./${product.product_id}`}>
                                        <button className="btn detail-btn action-btn"><i className="bi bi-info-circle"></i> Details</button>
                                    </Link>
                                    <Link to={`/admin/editproduct/${product.product_id}`}>
                                        <button className="btn edit-btn action-btn"><i className="bi bi-pencil-square"></i> Edit</button>
                                    </Link>
                                    <button className="btn delete-btn action-btn" onClick={() => { handleDeleteProduct(product.product_id) }}>
                                        <i className="bi bi-trash3"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
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
    )
}
export default ViewProducts;