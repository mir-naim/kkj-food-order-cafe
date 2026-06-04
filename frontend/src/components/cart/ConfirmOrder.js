//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Confirm Order page 
//Descrption: In this page , order summary will be shown 
//First written on: 24 September, 2023
//Edited on:


import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import axios from "axios";
import api from "../../utils/api";


const ConfirmOrder = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Use useNavigate to get the navigation function instead of history


  //Calculate Order Prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingPrice = itemsPrice > 20 ? 0 : 2
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2))
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2)

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

    const codPaymentId = `COD_${new Date().getFullYear()}${new Date().getMonth() + 1
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
        status: "COD"
      }
    };

    try {
      await api.post("/api/v1/order/new", order);

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
          <p className="mb-4">
            <b>Address:</b>{" "}
            {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
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
                      {item.quantity} x {item.price} RM = <b>{item.quantity * item.price} RM</b>
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
              Subtotal: <span className="order-summary-values">{itemsPrice} RM</span>
            </p>
            <p>
              Shipping: <span className="order-summary-values">{shippingPrice} RM</span>
            </p>
            <p>
              Tax: <span className="order-summary-values">{taxPrice} RM</span>
            </p>

            <hr />

            <p>
              Total: <span className="order-summary-values">{totalPrice} RM</span>
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
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
