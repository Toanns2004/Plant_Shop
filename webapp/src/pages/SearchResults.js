import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import productService from "../services/product-service";


const SearchResults = () => {
    const location = useLocation();
    const searchKey = new URLSearchParams(location.search).get('key');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        productService.searchProducts(searchKey)
            .then(response => {
                setSearchResults(response.data)
            })
            .catch(error => {
                console.error('Error searching products:', error);
            });
    }, [searchKey])

    return(
        <div className="container">
            {Array.isArray(searchResults) ? (
                searchResults.map((result) => (
                    <p>{result.product_name}</p>
                ))
            ) : (
                <h4>No product found!</h4>
            )}
        </div>
    )
}
export default SearchResults;