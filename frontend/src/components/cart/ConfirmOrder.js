//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Confirm Order page 
//Descrption: In this page , order summary will be shown 
//First written on: 24 September, 2023
//Edited on:



import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import axios from "axios";
import api from "../../utils/api";
import { useSelector, useDispatch } from "react-redux";



const ConfirmOrder = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Use useNavigate to get the navigation function instead of history
  const dispatch = useDispatch(); // Use dispatch to remove cart items after order
  

  //Calculate Order Prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingPrice = 0;
  const taxPrice = 0;
  const totalPrice = itemsPrice.toFixed(2);

  const [showQRPayment, setShowQRPayment] = useState(false);

  
  const processToPayment = () => {
    const data = {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice,
      taxPrice,
      totalPrice
    }
    sessionStorage.setItem('orderInfo', JSON.stringify(data))
    navigate("/payment");
  }

  const cashOnDeliveryHandler = async () => {

  const codPaymentId = `Cash_${new Date().getFullYear()}${new Date().getMonth() + 1
    }${new Date().getDate()}_${Date.now()}`;

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo: {
      id: codPaymentId,
      status: "Cash Paid"
    }
  };

  try {
    await api.post("/api/v1/order/new", order);

    // Clear cart storage
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingInfo");
    sessionStorage.removeItem("orderInfo");

    // Clear Redux cart state
    dispatch({
      type: "CLEAR_CART",
    });

    navigate("/success");
  } catch (error) {
    console.log(error);
  }
};

const cancelQRPayment = () => {

  // Clear the QR payment popup
  setShowQRPayment(false);

  // Return to Home page
  navigate("/");

};

const completeQRPayment = async () => {

    const qrPaymentId = `QR_${Date.now()}`;

    const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo: {
            id: qrPaymentId,
            status: "QR Paid"
        }
    };

    try {

        await api.post("/api/v1/order/new", order);

        localStorage.removeItem("cartItems");
        localStorage.removeItem("shippingInfo");
        sessionStorage.removeItem("orderInfo");

        dispatch({
            type: "REMOVE_ALL_ITEMS_CART"
        });

        navigate("/success");

    } catch (error) {

        console.log(error);

    }

};

  return (
    <Fragment>
      <MetaData title={"Confirm Order"} />
      <CheckoutSteps shipping confirmOrder />

      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          <h4 className="mb-3">User Info</h4>
          <p>
            <b>Name:</b>
            {user && user.name}
          </p>
          <p>
            <b>Phone:</b>
            {shippingInfo.phoneNo}
          </p>
             <p>
            <b>Student ID:</b>
            {shippingInfo.postalCode}
          </p>
          <p className="mb-4">
            <b>Address:</b>{" "}
            {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}`}
          </p>

          <hr />
          <h4 className="mt-4">Your Cart Items:</h4>

          {cartItems.map((item) => (
            <Fragment>
              <hr />
              <div className="cart-item my-1" key={item.product}>
                <div className="row">
                  <div className="col-4 col-lg-2">
                    <img
                      src={item.image}
                      alt="Laptop"
                      height="45"
                      width="65"
                    />
                  </div>

                  <div className="col-5 col-lg-6">
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </div>

                  <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                    <p>
                      {item.quantity} x RM{item.price} = <b>RM{item.quantity * item.price}</b>
                    </p>
                  </div>
                </div>
              </div>
              <hr />
            </Fragment>
          ))}
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Order Summary</h4>
            <hr />
            <p>
              Subtotal: <span className="order-summary-values">RM{itemsPrice}</span>
            </p>

            <hr />

            <p>
              Total: <span className="order-summary-values">RM{totalPrice}</span>
            </p>

            <hr />
            <button
              id="checkout_btn"
              className="btn btn-primary btn-block mb-3"
              onClick={processToPayment}
            >
              Payment via Card
            </button>

            <button
              id="checkout_btn"
              className="btn btn-success btn-block"
              style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
              onClick={cashOnDeliveryHandler}
            >
              Cash Payment
            </button>

            <button
              id="QRPayment_btn"
              className="btn btn-info btn-block mt-3"
              onClick={() => setShowQRPayment(true)}
            >
              QR Payment
          </button>

          {
          showQRPayment && (

          <div className="card mt-4 p-3 text-center">

              <h5>Scan QR Code</h5>

              <img
                  src="/images/qr-payment.png"
                  alt="QR Payment"
                  className="img-fluid mx-auto"
                  style={{maxWidth:"auto"}}
              />

              <button
                  className="btn btn-danger mt-4"
                  onClick={cancelQRPayment}
              >
                  Cancel Payment
              </button>

              <button
                  className="btn btn-success mt-3"
                  onClick={completeQRPayment}
              >
                  Complete Payment
              </button>

          </div>

          )
          }
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
