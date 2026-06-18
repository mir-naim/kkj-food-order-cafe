//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Payment page 
//Descrption: In this page , Payment details need to enter to make successful order
//First written on: 30 September, 2023
//Edited on:



import React, { Fragment, useEffect } from "react";

import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../actions/cartActions";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";
import { createOrder } from "../../actions/orderActions"; // Import the action to create a new order

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import api from "../../utils/api";
import { useAlert } from "react-alert";

const options = {
  style: {
    base: {
      fontSize: "16px",
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

const Payment = () => {
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const navigate = useNavigate(); // Use useNavigate to get the navigation function instead of history

  const { user } = useSelector((state) => state.auth);
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  useEffect(() => {}, []);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const submitHandler = async (e) => {
  e.preventDefault();

  document.querySelector("#pay_btn").disabled = true;

  try {
    const paymentData = {
      amount: Math.round(orderInfo.totalPrice * 100),
    };

    const { data } = await api.post(
      "/api/v1/payment/process",
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const clientSecret = data.client_secret;

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: user.name,
          email: user.email,
        },
      },
    });

    if (result.error) {
      alert.error(result.error.message);
      document.querySelector("#pay_btn").disabled = false;
      return;
    }

    if (result.paymentIntent.status === "succeeded") {
      const orderData = {
        orderItems: cartItems,
        shippingInfo,
        paymentInfo: {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        },
        itemsPrice: orderInfo.itemsPrice,
        taxPrice: orderInfo.taxPrice,
        shippingPrice: orderInfo.shippingPrice,
        totalPrice: orderInfo.totalPrice,
      };

      await dispatch(createOrder(orderData));
      
      // Clear cart data from browser storage
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingInfo");
      sessionStorage.removeItem("orderInfo");
      
      // Clear Redux cart state
      dispatch({
        type: "CLEAR_CART",
      });

      alert.success("Payment succeeded! Your order has been placed.");

      navigate("/success");
    } else {
      alert.error("Payment not completed");
    }

  } catch (error) {
    console.log(error);
    document.querySelector("#pay_btn").disabled = false;
    alert.error(error?.response?.data?.message || "Payment error");
  }
};

  return (
    <Fragment>
      <MetaData title={"Payment"} />
      <CheckoutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Card Info</h1>
            <div className="form-group">
              <label htmlFor="card_num_field">Card Number</label>
              <CardNumberElement
                type="text"
                id="card_num_field"
                className="form-control"
                options={options}
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_exp_field">Card Expiry</label>
              <CardExpiryElement
                type="text"
                id="card_exp_field"
                className="form-control"
                options={options}
              />
            </div>

            <div className="form-group">
              <label htmlFor="card_cvc_field">Card CVC</label>
              <CardCvcElement
                type="text"
                id="card_cvc_field"
                className="form-control"
                options={options}
              />
            </div>

            <button id="pay_btn" type="submit" className="btn btn-block py-3">
              Pay {`- ${orderInfo && orderInfo.totalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
