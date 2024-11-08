import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import orderService from "../services/order-service";
import Swal from "sweetalert2";



const ViewOrder = () => {
    const IMG_URL = "http://localhost:8080/images/";
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [orderStatus, setOrderStatus] = useState('');
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    useEffect(() => {
        orderService.getAllOrders(axiosConfig)
            .then(response => {
                const ordersData = response.data;
                setOrders(ordersData);
                const orderStatusData = {};
                ordersData.forEach(order => {
                    orderStatusData[order.id] = order.order_status;
                });
            })
            .catch(error => {
                console.error("Get all orders Error: ", error)
            })
    }, [updateTrigger])

    // if (!orders) {
    //     return <div>Loading...</div>;
    // }

    useEffect(() => {
        const filtered = orders.filter((order) => {
            const matchName = order.user?.fullname && order.user.fullname.toLowerCase().includes(searchValue.toLowerCase());
            const matchStatus = selectedStatus ? order.order_status === selectedStatus : true;
            return matchName && matchStatus;
        });
        console.log(filtered);
        setFilteredOrders(filtered);
        setCurrentPage(1);
    }, [searchValue, selectedStatus, orders]);

    const formatDate = (dateTimeString) => {
        const timestamp = new Date(dateTimeString).getTime();
        const date = new Date(timestamp);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const handleDeleteOrder = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This order will be removed from your order list!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5ba515',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if(result.isConfirmed){
                orderService.deleteOrderById(id, axiosConfig)
                    .then(response => {
                        Swal.fire({
                            title: 'Delete Successfully!',
                            text: 'Order removed!',
                            icon: 'success',
                            confirmButtonColor: '#5ba515'
                        });
                        setUpdateTrigger(prevValue => prevValue + 1);
                    })
                    .catch((error) => {
                        console.error(`Error deleting order with ID ${id}:`, error);
                        Swal.fire({
                            title: 'Delete error!',
                            text: 'An error occurred while deleting order!',
                            icon: 'error',
                            confirmButtonColor: '#dc3545'
                        });
                    });
            }
        })
    }
    const handleRowClick = (index) => {
        setSelectedRowIndex(index);
        const selectedOrderStatus = orders[index].order_status;
        setOrderStatus(selectedOrderStatus);
    };
    const onChangeStatus = (e) => {
        const {name, value} = e.target;
        setOrderStatus(prevStatus => ({
            ...prevStatus, [name] : value
        }));
    }
    const handleChangeStatus = (e) => {
        e.preventDefault();
        if (!orderStatus || selectedRowIndex === null) {
            return;
        }
        const orderId = orders[selectedRowIndex].order_id;
        orderService.updateOderStatus(orderId, orderStatus, axiosConfig)
            .then(res => {
                Swal.fire({
                    title: 'Success',
                    text: 'Status updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok!',
                    confirmButtonColor: '#5ba515'
                });
                setUpdateTrigger(prevValue => prevValue + 1);
                setSelectedRowIndex(null);
                navigate(`/admin/vieworders`);
            })
            .catch((error) => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                Swal.fire({
                    title: 'Update error!',
                    text: 'An error occurred while update status!',
                    icon: 'error',
                    confirmButtonColor: '#dc3545'
                });
            });
    }
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleNextPage = () => {
        if (currentPage < Math.ceil(orders.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    const filterOrdersByStatus = (selectedStatus) => {
        if (selectedStatus === 'waiting' || selectedStatus === 'confirmed' || selectedStatus === 'delivering' || selectedStatus === 'completed' || selectedStatus === 'cancelled') {
            console.log(selectedStatus);
            const filteredByStatus = orders.filter((order) => order.order_status === selectedStatus);
            setFilteredOrders(filteredByStatus);
        } else {
            setFilteredOrders(orders);
        }
    };

    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    return(
        <div>
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-3"><b>View All Orders</b></div>
                        <div className="col-md-9 d-flex justify-content-end align-items-center">
                            <div className="col-md-4 d-flex justify-content-end align-items-center">
                                <span className="d-inline-block align-middle" style={{ marginRight: '5px' }}>Filter by:</span>
                                <div>
                                    <select className="form-select "
                                            aria-label="Default select example"
                                            onChange={(e) => filterOrdersByStatus(e.target.value)}
                                    >
                                        <option value="none" selected>None</option>
                                        <option value="waiting">Waiting</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="delivering">Delivering</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-5 d-flex align-items-center">
                                <div className="input-group mb-0 h-100" style={{ paddingLeft: '10px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Find order by customer name..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/*<div className="col-md-3 d-flex align-items-center justify-content-end">*/}
                            {/*    <Link to="/admin/addorder">*/}
                            {/*        <button className="btn add-btn float-end"><i className="bi bi-plus-lg"></i> New Order</button>*/}
                            {/*    </Link>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col-2">ID</th>
                            <th scope="col-3">Customer</th>
                            <th scope="col-2">Order Date</th>
                            <th scope="col-1">Total Amount</th>
                            <th scope="col-1">Payment Method</th>
                            <th scope="col-1">Status</th>
                            <th scope="col-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentOrders.map((order, index) => (
                            <tr key={index} onClick={() => handleRowClick(index)}>
                                <td>{order.order_id}</td>
                                <td>{order.user?.fullName}</td>
                                <td>{formatDate(order.order_date)}</td>
                                <td>{order.total_amount}$</td>
                                <td>{order.pay_method}</td>
                                <td>{order.order_status}</td>
                                <td className="d-flex flex-row">
                                    <Link to={`./${order.order_id}`}>
                                        <button className="btn detail-btn action-btn"><i
                                            className="bi bi-info-circle"></i> Details</button>
                                    </Link>
                                    <button type="button" className="btn edit-btn" data-bs-toggle="modal" data-bs-target="#statusUpdate">
                                        <i className="bi bi-pencil-square"></i> Update Status
                                    </button>
                                    <button className="btn delete-btn action-btn" onClick={() => {handleDeleteOrder(order.order_id)}} >
                                        <i className="bi bi-trash3"></i> Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="modal fade" id="statusUpdate" tabIndex="-1" aria-labelledby="exampleModalLabel"
                         aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <form onSubmit={handleChangeStatus}>
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabel">Update Order Status</h1>
                                    </div>

                                    <div className="modal-body">
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="waiting"
                                                name="newStatus"
                                                value="waiting"
                                                checked={orderStatus === 'waiting'}
                                                onChange={onChangeStatus}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="waiting" className="form-check-label">Waiting</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="confirmed"
                                                name="newStatus"
                                                value="confirmed"
                                                checked={orderStatus === 'confirmed'}
                                                onChange={onChangeStatus}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="confirmed" className="form-check-label">Confirmed</label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="delivering"
                                                name="newStatus"
                                                value="delivering"
                                                checked={orderStatus === 'delivering'}
                                                onChange={onChangeStatus}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="delivering" className="form-check-label">Delivering</label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="completed"
                                                name="newStatus"
                                                value="completed"
                                                checked={orderStatus === 'completed'}
                                                onChange={onChangeStatus}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="completed" className="form-check-label">Completed</label>
                                        </div>

                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                id="cancelled"
                                                name="newStatus"
                                                value="cancelled"
                                                checked={orderStatus === 'cancelled'}
                                                onChange={onChangeStatus}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="cancelled" className="form-check-label">Cancelled</label>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn add-btn" data-bs-dismiss="modal">Save
                                            changes
                                        </button>
                                        <button type="button" className="btn delete-btn"
                                                data-bs-dismiss="modal">Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ul className="pagination float-end">
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Previous" onClick={handlePreviousPage}>
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            {Array.from({ length: Math.ceil(orders.length / itemsPerPage) }, (_, index) => (
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

export default ViewOrder;