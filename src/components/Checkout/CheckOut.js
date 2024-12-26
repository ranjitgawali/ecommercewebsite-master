import React, { useEffect, useState } from 'react'
import {selectcustId,selectCustomerObj} from '../../store/slice/Userslice.js';
import { useSelector ,useDispatch} from 'react-redux';
import{fetchCartProducts,selectCartProducts} from '../../store/slice/Userslice.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
function Checkout() {
    //debugger
    const cartItems = useSelector(selectCartProducts);
    const custObj = useSelector(selectCustomerObj);
    const custId=custObj.custId;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const totalPrice = cartItems.reduce((total, cartItems) => {
        return total + (cartItems.productPrice * cartItems.quantity);
    }, 0);

    const [placeObj, setPlaceobj] = useState({

        //"saleId": 0,
        "custId": 0,
        "saleDate": new Date(),
        "totalInvoiceAmount": 0,
        "discount": 0,
        "paymentNaration": "",
        "deliveryAddress1": "",
        "deliveryAddress2": "",
        "deliveryCity": "",
        "deliveryPinCode": "",
        "deliveryLandMark": "",
        "isCanceled": false,

    })
    const getplaceObj = (event, key) => {
        setPlaceobj(prev => ({ ...prev, [key]: event.target.value }))
    }
    //******** Place Order */
    const placeorder = async () => {
        debugger;
        placeObj.totalInvoiceAmount = totalPrice;
        placeObj.custId = custId;
        const response = await axios.post("https://freeapi.gerasim.in/api/BigBasket/PlaceOrder", placeObj)
        if (response.data.result) {
            for(let i=0;i<cartItems.length;i++)
                {
                    const response = await axios.get("https://freeapi.gerasim.in/api/BigBasket/DeleteProductFromCartById?id=" + cartItems[i].cartId);
                   
                }
            dispatch(fetchCartProducts(custId));
           toast.success("Order Succefull")
           navigate("/");
        }

        else {
            toast.error("Failed")
        }

    }
    //********** Saled Order */
    const [saledOrd, setSaledOrder] = useState([])
    const saledOrder = async () => {
        debugger;
        const result = await axios.get("https://freeapi.gerasim.in/api/BigBasket/GetAllSaleByCustomerId?id=" + custId);
        setSaledOrder(result.data.data)
    }
    useEffect(()=>{
        saledOrder();
    },[])
    return (
        <>
            <div className='container mt-5'>

                <div class="row">

                    <div class="col-lg-8 col-md-12 mb-3">
                        <div class="card shadow">
                            <div class="card-header bg-success text-white">
                                <h4>Billing Address</h4>
                            </div>
                            <div class="card-body mb-5">

                                <div class="row">

                                    <div class="col-lg-6 col-md-6">
                                        <input type="text" placeholder="City " class="form-control m-2" onChange={(e) => { getplaceObj(e, 'deliveryCity') }} />
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <input type="text" placeholder="Pincode " class="form-control m-2" onChange={(e) => { getplaceObj(e, 'deliveryPinCode') }} />
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <textarea placeholder="Address Line 1 " class="form-control m-2" rows="3" onChange={(e) => { getplaceObj(e, 'deliveryAddress1') }}></textarea>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <textarea placeholder="Address Line  2" class="form-control m-2" rows="3" onChange={(e) => { getplaceObj(e, 'deliveryAddress2') }}></textarea>
                                    </div>
                                    <div class="col-lg-6 col-md-6">
                                        <textarea placeholder="Landmark" class="form-control m-2" rows="3" onChange={(e) => { getplaceObj(e, 'deliveryLandMark') }}></textarea>
                                    </div>



                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4 col-md-12">
                        <div class="card shadow ">
                            <div class="card-header bg-success text-white">
                                <h4>Your Order</h4>

                            </div>
                            <div class="card-body">


                                {cartItems.map((cartItem) => (
                                    <div key={cartItem.productId} className="border-top d-flex mt-2">
                                        <img className="img-fluid h-25 w-25 p-2" src={cartItem.productImageUrl} alt="" />
                                        <div className="ps-3">
                                            <p className="p-0 m-0 fw-semibold"><b>{cartItem.productName}</b></p>
                                            <p className="p-0 m-0">Price: {cartItem.productPrice}</p>
                                            <p className="text-start mt-4"><button className="btn">QTY : <b>{cartItem.quantity}</b> </button></p>
                                        </div>
                                    </div>
                                ))}

                                <div class="border-top ">


                                    <div class=" border-top ">
                                        <div class="d-flex justify-content-between mt-2">
                                            <p class="fw-semibold">Total :</p>
                                            <p class="fw-semibold">${totalPrice}</p>
                                        </div>
                                    </div>
                                    <div class="row border-top ">
                                        <div class="col-12 text-center mt-2">
                                            <div class="w-100 bg-black">
                                                <button class="btn text-white rounded-0 " onClick={placeorder}>Place Order</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
{/* 
                    <div class="col-lg-4 col-md-12">
                        <div class="card shadow ">
                            <div class="card-header bg-primary text-white">
                                <h4>Saled Order</h4>

                            </div>
                            <div class="card-body">

                                {
                                    saledOrd.map((sale) => {
                                          <div className="ps-3">
                                                <p className="p-0 m-0 fw-semibold"><b>{JSON.stringify(sale)}</b></p>
                                           </div>
                                        
                                    })
                                }
                            </div>
                        </div>
                    </div> */}
                </div>

            </div>
        </>
    )
}

export default Checkout
