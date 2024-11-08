import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import orderService from "../services/order-service";
import Swal from "sweetalert2";



const OrderDetails = () => {
    const IMG_URL = "http://localhost:8080/images/";
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState({});
    const {id} = useParams();
    const [details, setDeatails] = useState([]);
    const [orderStatus, setOrderStatus] = useState('');
    const [updateTrigger, setUpdateTrigger] = useState(0);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    useEffect(() => {
        orderService.getOrderById(id, axiosConfig)
            .then(res => {
                setOrderDetails(res.data);
                setOrderStatus(res.data.order_status);
            })
            .catch(error => {
                console.error("Get order details Error: ", error)
            })
        orderService.getOrderDetailsByOrderId(id, axiosConfig)
            .then(res => {
                setDeatails(res.data)
            })
            .catch(error => {
                console.error("Get order details Error: ", error)
            })
    }, [updateTrigger, id])
    if (!orderDetails || !orderDetails.order_date) {
        return <div>Loading...</div>;
    }
    const dateTimeString = orderDetails.order_date;
    const timestamp = new Date(dateTimeString).getTime();
    const formatDate = (timestamp) => {
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

    const onChangeStatus = (e) => {
        const {name, value} = e.target;
        setOrderStatus(prevStatus => ({
            ...prevStatus, [name] : value
        }));
    }
    const handleChangeStatus = (e) => {
        e.preventDefault();
        orderService.updateOderStatus(id, orderStatus, axiosConfig)
            .then(res => {
                Swal.fire({
                    title: 'Success',
                    text: 'Status updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok!',
                    confirmButtonColor: '#5ba515'
                });
                setUpdateTrigger(prevValue => prevValue + 1)
                navigate(`/admin/vieworders/${id}`);
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

    return(
        <div>
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col col-md-6"><b>Order Details</b></div>
                        <div className="col col-md-6">

                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <b><i>Order informations:</i> </b>
                    <hr/>
                    <div className="row mb-3">
                        <label className="col-sm-2 col-label-form"><b>Customer</b></label>
                        <div className="col-sm-10">
                            {orderDetails.user.fullName}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-2 col-label-form"><b>Shipping Address</b></label>
                        <div className="col-sm-10">
                            {orderDetails.shipping_address}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Order date</b></label>
                        <div className="col-sm-10">
                            {formatDate(timestamp)}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Total amount</b></label>
                        <div className="col-sm-10">
                            {orderDetails.total_amount} $
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Payment method</b></label>
                        <div className="col-sm-10">
                            {orderDetails.pay_method}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Order status</b></label>
                        <div className="col-sm-10">
                            {orderDetails.order_status}
                        </div>

                    </div>
                    <hr/>
                    <b><i>Product: </i></b>
                    <hr/>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Thumbnail</th>
                            <th scope="col">Product name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Subtotal</th>
                        </tr>
                        </thead>
                        <tbody>
                        {details.map(detail =>(
                            <tr>
                                <td><img src={IMG_URL + detail.product.thumbnail} width="75"/></td>
                                <td>{detail.product.product_name}</td>
                                <td>{detail.price} $</td>
                                <td>{detail.quantity} piece(s)</td>
                                <td>{detail.sub_total} $</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div class="modal fade" id="statusUpdate" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
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
                                        <button type="submit" className="btn add-btn" data-bs-dismiss="modal">Save changes</button>
                                        <button type="button" className="btn delete-btn"
                                                data-bs-dismiss="modal">Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button type="button" className="btn edit-btn" data-bs-toggle="modal" data-bs-target="#statusUpdate">
                            <i className="bi bi-pencil-square"></i> Update Status
                        </button>
                        <Link to="/admin/vieworders">
                            <button className="btn add-btn"><i className="bi bi-people-fill"></i> View All Orders</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails;