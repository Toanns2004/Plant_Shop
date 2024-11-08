import {useEffect, useState} from "react";
import categoryService from "../services/category-service";
import {Link} from "react-router-dom";


const CategorySideBar = () => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        categoryService.getAllCategories()
            .then(res => {
                setCategories(res.data)
            })
            .catch(error => {
                console.error("Error fetching category:", error);
            });
    },[])

    return(
        <div className="cat-sb">
            {categories.map(category => (
                <div className="cat-sb-item">
                    <Link to={`/category/${category.prefix}`}>
                        <h5>{category.cat_name}</h5>
                    </Link>
                </div>
            ))}
        </div>
    )
}

export default CategorySideBar;