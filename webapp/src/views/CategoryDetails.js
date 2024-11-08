import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import categoryService from "../services/category-service";

const CategoryDetails = () => {
    const [categoryDetail, setCategoryDetail] = useState({});
    const {id} = useParams();

    useEffect(() => {
        categoryService.categoryDetails(id)
            .then(response => {
                setCategoryDetail(response.data);
            })
            .catch(error => {
                console.error("Get user details Error: ", error)
            })
    },[id])

    return(
        <div>
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col col-md-6"><b>Category Details</b></div>
                        <div className="col col-md-6">

                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <label className="col-sm-2 col-label-form"><b>Category Prefix</b></label>
                        <div className="col-sm-10">
                            {categoryDetail.prefix}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-2 col-label-form"><b>Category Name</b></label>
                        <div className="col-sm-10">
                            {categoryDetail.cat_name}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Description</b></label>
                        <div className="col-sm-10">
                            {categoryDetail.description}
                        </div>
                    </div>

                    <div className="text-center">
                        <Link to={`/admin/editcategory/${categoryDetail.cat_id}`}>
                            <button className="btn edit-btn"><i className="bi bi-pencil-square"></i> Edit Category</button>
                        </Link>
                        <Link to="/admin/viewcategories">
                            <button className="btn add-btn"><i className="bi bi-tags"></i> View All Categories</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CategoryDetails;