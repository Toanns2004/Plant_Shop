import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import userService from "../services/user-service";
import Swal from "sweetalert2";


const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = user ?user.token : '';


    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    useEffect(() => {
        if(user){
            userService.getAllUsers(axiosConfig)
                .then(response => {
                    console.log(response.data);
                    setUsers(response.data);
                })
                .catch(error => {
                    console.error("Get all users Error: ", error)
                })
        }
    },[])

    useEffect(() => {
        const filtered = users.filter((user) => {
            const matchName = user.fullname && user.fullname.toLowerCase().includes(searchValue.toLowerCase());
            const matchRole = selectedRole ? user.role === selectedRole : true;
            return matchName && matchRole;
        });
        console.log(filtered);
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [searchValue, selectedRole, users]);

    const handleDeleteUser = (user_id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "User will be removed from your users list!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5ba515',
            cancelButtonColor: '#dc3545',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
                if(result.isConfirmed){
                    userService.deleteUser(user_id, axiosConfig)
                        .then(response => {
                            setUsers(users.filter((deletedUser)=> deletedUser.user_id !== user_id));
                            Swal.fire({
                                title: 'Delete Successfully!',
                                text: 'User removed from your users list!',
                                icon: 'success',
                                confirmButtonColor: '#5ba515'
                            });
                        })
                        .catch((error) => {
                            console.error(`Error deleting user with ID ${user_id}:`, error);
                            Swal.fire({
                                title: 'Delete error!',
                                text: 'An error occurred while deleting user!',
                                icon: 'error',
                                confirmButtonColor: '#dc3545'
                            });
                        });
                }
            })
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
        if (currentPage < Math.ceil(users.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const filterUsersByRole = (selectedRole) => {
        if (selectedRole === 'admin' || selectedRole === 'user') {
            const filteredByRole = users.filter((user) => user.role === selectedRole);
            setFilteredUsers(filteredByRole);
        } else {
            setFilteredUsers(users);
        }
    };

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return(
        <div>
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-3"><b>View All Users</b></div>
                        <div className="col-md-9 d-flex justify-content-end align-items-center">
                            <div className="col-md-4 d-flex justify-content-end align-items-center">
                                <span className="d-inline-block align-middle" style={{ marginRight: '5px' }}>Filter by:</span>
                                <div>
                                    <select className="form-select " aria-label="Default select example" onChange={(e) => filterUsersByRole(e.target.value)}>
                                        <option value="none" selected>None</option>
                                        <option value="admin">Role: Admin</option>
                                        <option value="user">Role: User</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-5 d-flex align-items-center">
                                <div className="input-group mb-0 h-100" style={{ paddingLeft: '10px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Find user by username or name..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3 d-flex align-items-center justify-content-end">
                                <Link to="/admin/adduser">
                                    <button className="btn add-btn float-end"><i className="bi bi-plus-lg"></i> Add New User</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                        <tr>
                            <th className=" align-middle" scope="col">ID</th>
                            <th className=" align-middle" scope="col">Username</th>
                            <th className=" align-middle" scope="col">Full Name</th>
                            <th className=" align-middle" scope="col">Email</th>
                            <th className=" align-middle" scope="col">Role</th>
                            <th className="text-center align-middle" scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.user_id}>
                                <th className=" align-middle" scope="row">{user.user_id}</th>
                                <td className=" align-middle"> {user.username}</td>
                                <td className=" align-middle">{user.fullname}</td>
                                <td className=" align-middle">{user.email}</td>
                                <td className=" align-middle">{user.role}</td>
                                <td className="text-center align-middle">
                                    <Link to={`./${user.user_id}`}>
                                        <button className="btn detail-btn action-btn"><i
                                            className="bi bi-info-circle"></i> Details</button>
                                    </Link>
                                    <Link to={`/admin/edituser/${user.user_id}`}>
                                        <button className="btn edit-btn action-btn"><i
                                            className="bi bi-pencil-square"></i> Edit</button>
                                    </Link>
                                    <button className="btn delete-btn action-btn" onClick={() => {handleDeleteUser(user.user_id)}}>
                                        <i className="bi bi-trash3"></i> Delete</button>
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
                            {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, index) => (
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
export default ViewUsers;