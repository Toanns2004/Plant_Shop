import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import userService from "../services/user-service";
import axios from "axios";

const UserDetails = () => {
    const [userDetails, setUserDetails] = useState({});
    const {id} = useParams();

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user.token;


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }
    useEffect(() => {
        userService.userDetails(id, axiosConfig)
            .then(response => {
                setUserDetails(response.data)
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
                        <div className="col col-md-6"><b>User Details</b></div>
                        <div className="col col-md-6">

                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <label className="col-sm-2 col-label-form"><b>Username</b></label>
                        <div className="col-sm-10">
                            {userDetails.username}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label className="col-sm-2 col-label-form"><b>Full Name</b></label>
                        <div className="col-sm-10">
                            {userDetails.fullname}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Email</b></label>
                        <div className="col-sm-10">
                            {userDetails.email}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Phone Number</b></label>
                        <div className="col-sm-10">
                            {userDetails.phone}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>Role</b></label>
                        <div className="col-sm-10">
                            {userDetails.role}
                        </div>
                    </div>
                    <div className="row mb-4">
                        <label className="col-sm-2 col-label-form"><b>User Image</b></label>
                        <div className="col-sm-10">
                            <img src="{{ asset('images/' .  $student->student_image) }}" width="200"
                                 className="img-thumbnail"/>
                        </div>
                    </div>
                    <div className="text-center">
                        <Link to={`/admin/edituser/${userDetails.user_id}`}>
                            <button className="btn edit-btn"><i className="bi bi-pencil-square"></i> Edit User</button>
                        </Link>
                        <Link to="/admin/viewusers">
                            <button className="btn add-btn"><i className="bi bi-people-fill"></i> View All Users</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserDetails;