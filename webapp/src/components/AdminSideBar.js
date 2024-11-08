import {Link} from "react-router-dom";


const AdminSideBar = () => {
    return(
        <div className="admin-sb">
            <div className="accordion" id="accordionAdmin">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#usermanagement" aria-expanded="false" aria-controls="usermanagement">
                            <i className="bi bi-people"></i> Users Management
                        </button>
                    </h2>
                    <div id="usermanagement" className="accordion-collapse collapse"
                         data-bs-parent="#accordionAdmin">
                        <div className="accordion-body">
                            <Link to='/admin/viewusers'><button className="sb-btn btn-lg text-start"><i
                                className="bi bi-chevron-right"></i>View All Users</button></Link>
                            <Link to='/admin/adduser'><button className="sb-btn btn-lg text-start"><i
                                className="bi bi-chevron-right"></i>Add New User</button></Link>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#catmanagement" aria-expanded="false" aria-controls="catmanagement">
                            <i className="bi bi-tags"></i> Categories Management
                        </button>
                    </h2>
                    <div id="catmanagement" className="accordion-collapse collapse"
                         data-bs-parent="#accordionAdmin">
                        <div className="accordion-body">
                            <Link to='/admin/viewcategories'><button className="sb-btn btn-lg text-start"><i
                                className="bi bi-chevron-right"></i>View All Categories</button></Link>
                            <Link to='/admin/addcategory'><button className="sb-btn btn-lg text-start"><i
                                className="bi bi-chevron-right"></i>Add New Category</button></Link>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#prodmanagement" aria-expanded="false"
                                aria-controls="prodmanagement">
                            <i className="bi bi-tree"></i> Products Management
                        </button>
                    </h2>
                    <div id="prodmanagement" className="accordion-collapse collapse"
                         data-bs-parent="#accordionAdmin">
                        <div className="accordion-body">
                            <Link to='/admin/viewproducts'><button className="sb-btn btn-lg text-start"><i
                                className="bi bi-chevron-right"></i>View All Products</button></Link>
                            <Link to='/admin/addproduct'><button className="sb-btn btn-lg text-start"><i
                                className="bi bi-chevron-right"></i>Add New Product</button></Link>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#ordermanagement" aria-expanded="false"
                                aria-controls="ordermanagement">
                            <i className="bi bi-receipt"></i> Orders Management
                        </button>
                    </h2>
                    <div id="ordermanagement" className="accordion-collapse collapse"
                         data-bs-parent="#accordionAdmin">
                        <div className="accordion-body">
                            <Link to='/admin/vieworders'><button className="sb-btn btn-lg text-start"><i
                                className="bi bi-chevron-right"></i>View All Orders</button></Link>
                            {/*<Link to='./addorder'><button className="sb-btn btn-lg text-start"><i*/}
                            {/*    className="bi bi-chevron-right"></i>Add New Order</button></Link>*/}

                        </div>
                    </div>
                </div>
                {/*<div className="accordion-item">*/}
                {/*    <h2 className="accordion-header">*/}
                {/*        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"*/}
                {/*                data-bs-target="#report" aria-expanded="false"*/}
                {/*                aria-controls="report">*/}
                {/*            <i className="bi bi-graph-up-arrow"></i> Reports*/}
                {/*        </button>*/}
                {/*    </h2>*/}
                {/*    <div id="report" className="accordion-collapse collapse"*/}
                {/*         data-bs-parent="#accordionAdmin">*/}
                {/*        <div className="accordion-body">*/}
                {/*            <Link to=''><button className="sb-btn btn-lg text-start"><i*/}
                {/*                className="bi bi-chevron-right"></i>Statistics</button></Link>*/}
                {/*            <Link to=''><button className="sb-btn btn-lg text-start"><i*/}
                {/*                className="bi bi-chevron-right"></i>Revenue Report</button></Link>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
export default AdminSideBar;