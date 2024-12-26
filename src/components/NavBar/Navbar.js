import { Link, useNavigate } from "react-router-dom";
import '../../services/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { toast } from 'react-toastify';
import React from 'react';

import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectcustId, selectIsLoggedIn, selectCartProducts, selectCustomerObj } from '../../store/slice/Userslice.js';
import { fetchCartProducts } from '../../store/slice/Userslice.js';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartProducts = useSelector(selectCartProducts)
    // const custId = useSelector(selectcustId);
    const loginIbj = useSelector(selectCustomerObj);
    const custId = loginIbj.custId;
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const [categoryList, setCategoryList] = useState([]);
    const [registeModal, setRegisteModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    

    const loginobj = {
        userName: username,
        userPassword: password,
    }

    const [cusObj, setCustObj] = useState({
        "custId": 0,
        "name": "",
        "mobileNo": "",
        "password": ""
    })
    useEffect(() => {
        dispatch(fetchCartProducts(custId));
    }, [dispatch, custId]);
    const getCategoryList = async () => {
        try {
            const result = await axios.get("https://freeapi.gerasim.in/api/BigBasket/GetAllCategory");
            if (result.data.data !== undefined) {
                setCategoryList(result.data.data);
            }
        } catch (error) {
            toast.error("Error fetching category list:", error);
        }

    }

    /******** Delete Cart item */
    
    const deleteCart = async (product) => {
        debugger;
        const response = await axios.get("https://freeapi.gerasim.in/api/BigBasket/DeleteProductFromCartById?id=" + product.cartId);
        Swal.fire({
            title: 'Are you absolutely sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
          })
           if (response.data.result.isConfirmed) {
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
              );
            dispatch(fetchCartProducts(custId));
        }
        else {

        }
    }


    /*********** Read Username and Password */
    const handleuserlogin = (e) => {
        setUsername(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }
    /*********** Login ************* */
    const handleLogin = async () => {
        debugger;
        try {

            const result = await axios.post("https://freeapi.gerasim.in/api/BigBasket/Login", loginobj);
            if (result.data.result) {
                dispatch(login(result.data.data));
                dispatch(fetchCartProducts(result.data.data.custId));
                setShowModal(false);

            }
        } catch (error) {
            toast.error(error, {
                position: toast.POSITION.TOP_RIGHT,
            },0);
        }

    };
    /********** Log out***********8 */
    const handleLogout = () => {
        navigate("/product")
        dispatch(logout());

    };
    useEffect(() => {
        getCategoryList();
    }, []);

    //**************  Handle Modal Login ************* */
    const showLoginModal = () => {
        setShowModal(true)
    }

    const closeModalLogin = () => {
        setShowModal(false);
    }
    /********** Check Out redirect*** */
    const showCheckout = () => {
        debugger

        navigate("/checkout");
    }
    /**************Handle Modal Register************* */
    const closeModalregister = () => {
        setRegisteModal(false);
    }

    const registerUser = (event, key) => {
        setCustObj(prev => ({ ...prev, [key]: event.target.value }));
    }

    const handleregister = async () => {

        try {
            const response = await axios.post("https://freeapi.gerasim.in/api/BigBasket/RegisterCustomer", cusObj);
            if (response.data.result) {
                toast.success("Register Successfully");
                closeModalregister();
            }
            else {
                toast.error("Failed to Register")
            }
        }
        catch (error) {
            alert(error)
        }

    }
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-success fixed-top mynav pb-2 pt-2 mb-10">
                <div className="container">
                    <div className="navbar-brand align-self-baseline">
                        <FontAwesomeIcon icon={faCartShopping} className="me-2" style={{ color: 'red', fontSize: '25px' }} /> BigBasket
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02"
                        aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <div className="navbar-nav ms-auto mb-2 mb-lg-0 text-dark">
                            <div className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Categories
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {categoryList.map(category => (
                                        <li key={category.categoryId}>
                                            <Link className="dropdown-item" to={`/product/${category.categoryId}`}>{category.categoryName}</Link>
                                            {/* <Link className="dropdown-item">{category.categoryName}</Link> */}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {
                                isLoggedIn ? <div className="nav-item dropdown" >
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <FontAwesomeIcon icon={faCartShopping} className="me-2" />{cartProducts.length}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                        {(cartProducts && cartProducts.length > 0) && cartProducts.map(cartItem => (
                                            <li key={cartItem.productId}>
                                                <Link className="dropdown-item" to={'/'} >
                                                    {/* {cartItem.productName} - Quantity: {cartItem.quantity} */}
                                                    <div key={cartItem.productId} className="border-top d-flex mt-2 " style={{ width: "200px" }}>
                                                        <img className="img-fluid h-25 w-25 p-2" src={cartItem.productImageUrl} alt="" />
                                                        <div className="ps-3">
                                                            <p className="p-0 m-0 fw-semibold"><b>{cartItem.productName}</b></p>
                                                            <p className="p-0 m-0">Price: {cartItem.productPrice}</p>
                                                            <p className="text-start"><button className="btn">QTY : <b>{cartItem.quantity}</b> </button></p>
                                                            <Button onClick={() => { deleteCart(cartItem) }}> <FontAwesomeIcon icon={faTrash} className="sm-2" /></Button>

                                                        </div>
                                                    </div>

                                                </Link>
                                            </li>
                                        ))}
                                        <Button className="btn btn-secondary form control" >View Cart</Button>
                                        <Button className="btn btn-success form control" onClick={() => { showCheckout() }}>Checkout</Button>

                                    </ul>
                                </div> : <div className="nav-item">
                                    <a className="nav-link " id="navbarDropdown" aria-expanded="false">
                                        <FontAwesomeIcon icon={faCartShopping} className="me-2" />
                                    </a>

                                </div>


                            }

                            {
                                isLoggedIn ? (<div className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <FontAwesomeIcon icon={faUser} />  {loginIbj.name}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li >
                                            <Link className="dropdown-item" onClick={() => { handleLogout() }} to={'/'}>Logout</Link>
                                        </li>

                                    </ul>
                                </div>) : (<div className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <FontAwesomeIcon icon={faUser} />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                        <li >
                                            <Link className="dropdown-item" onClick={() => { showLoginModal() }}>Login</Link>
                                        </li>
                                        <li >
                                            <Link className="dropdown-item" onClick={() => { setRegisteModal(true) }}>Register</Link>
                                        </li>
                                    </ul>
                                </div>)
                            }

                        </div>
                    </div>
                </div>
            </nav>
            <div className='mt-5'></div>
            <div className="row">
                <div className="col-12">
                    <Modal show={showModal} onHide={closeModalLogin}>
                        <Modal.Header closeButton className="bg-success text-center text-white">
                            <Modal.Title>Login</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div>

                                    <div>
                                        <div className="row">
                                            <div className='col-12'>
                                                <label>User Name</label>
                                                <input type="text" className='form-control' onChange={(e) => { handleuserlogin(e) }} />
                                            </div>
                                        </div>
                                        <div className="row my-2">
                                            <div className="col-12">
                                                <label>Password</label>
                                                <input type="password" className="form-control" onChange={(e) => { handlePassword(e) }} />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <Button className="btn btn-primary  form-control" onClick={handleLogin}>Login</Button>
                                            </div>
                                            <div className="col-6">
                                                <Button className="btn btn-secondary form-control">Reset</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Modal show={registeModal} onHide={closeModalregister}>
                        <Modal.Header closeButton className="bg-success text-white">
                            <Modal.Title>Register</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div>
                                    <div>
                                        <div className="row">
                                            <div className='col-12'>
                                                <label> Name</label>
                                                <input type="text" className='form-control' onChange={(e) => { registerUser(e, 'name') }} />
                                            </div>

                                            <div className='col-12'>
                                                <label>Mobile No</label>
                                                <input type="text" className='form-control' onChange={(e) => { registerUser(e, 'mobileNo') }} />
                                            </div>
                                        </div>
                                        <div className="row my-2">
                                            <div className="col-12">
                                                <label>Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    onChange={(e) => { registerUser(e, 'password') }}
                                                />

                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <Button className="btn btn-primary form-control" onClick={handleregister}>Save</Button>
                                            </div>
                                            <div className="col-6">
                                                <Button className="btn btn-secondary form-control">Reset</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>



        </>


    );
};

export default Navbar;
