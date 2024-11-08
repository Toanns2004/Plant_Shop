import {useEffect, useState} from "react";
import productService from "../services/product-service";
import '../assets/css/search.css';
import {useNavigate} from "react-router-dom";


const SearchProduct = () => {
    const IMG_URL = "http://localhost:8080/images/";
    const navigate = useNavigate();
    const [searchKey, setSearchKey] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(searchKey.trim() === ''){
            setSearchResults([]);
            setIsLoading(false);
        }else {
            setIsLoading(true)
            productService.searchProducts(searchKey)
                .then(response => {
                    const results = response.data;
                    setSearchResults(results);
                    setIsLoading(false)
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                    setIsLoading(false);
                });
        }
    }, [searchKey])

    const handleSearch = (e) => {
        e.preventDefault();
        const encodedSearchKey = encodeURIComponent(searchKey);
        navigate(`/search?key=${encodedSearchKey}`);
        setSearchKey('');
    };

    return(
        <div className="col header-search">
            <form onSubmit={handleSearch} className="hm-searchbox">
                <input type="text"
                       placeholder="Enter product name ..."
                       value={searchKey}
                       onChange={(e) => setSearchKey(e.target.value)}
                />
                <button className="li-btn" type="submit"><i className="bi bi-search"></i></button>
            </form>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul className="search-rs-area">
                    {Array.isArray(searchResults) ? (
                        searchResults
                            .slice(0,5)
                            .map((result) => (
                            <a href={`/products/${result.product_id}`}key={result.id}>
                                <div className="hm-searchbox-rs">
                                    <div className="row">
                                        <div className="col-3">
                                            <img src={IMG_URL+result.thumbnail} alt="" className="img-fluid"/>
                                        </div>
                                        <div className="col-9">
                                            <li >
                                                {result.product_name}
                                            </li>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="hm-searchbox-rs">
                            <li>No results found.</li>
                        </div>
                    )}
                </ul>
            )}
        </div>
    )
}
export default SearchProduct;