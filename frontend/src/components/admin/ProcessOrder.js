//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Process users order 
//Descrption: Admin and staff can change user order status
//First written on: 8 October, 2023
//Edited on: 07 January, 2024


import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetails,
  updateOrder,
  clearErrors,
} from "../../actions/orderActions";
import { UPDATE_ORDERS_RESET } from "../../constants/orderConstants";
import Sidebar from "./Sidebar";
//import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const ProcessOrder = () => {
  const { id } = useParams(); // Get the 'id' parameter from the route using useParams
  //const navigate = useNavigate(); // Use useNavigate to get the navigation function instead of history

  const [status, setStatus] = useState("");
  const [cashPayment, setCashPayment] = useState("");



  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, order = {} } = useSelector((state) => state.orderDetails);

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order

  const { error, isUpdated } = useSelector(state => state.order)
  const orderId = id;

  useEffect(() => {
    dispatch(getOrderDetails(orderId));

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Order updated successfully");
      // Implementing Smart Notification
      if (status === "Delivered") {
        alert.info("Customer notified: Order has been delivered!");
      }

      dispatch({ type: UPDATE_ORDERS_RESET });
    }
  }, [dispatch, alert, isUpdated, orderId, error, status]);

  const updateOrderHandler = (id) => {

  const orderData = {
    status
  };

  if (
    paymentInfo?.status === "Cash Paid" ||
    paymentInfo?.status === "QR Paid"
    ) {

    if (cashPayment === "Yes") {

    orderData.paymentStatus =
        paymentInfo.status === "Cash Paid"
            ? "CASH PAID"
            : "QR PAID";

    }

    if (cashPayment === "No") {
      orderData.paymentStatus = "CANCELLED";
      orderData.status = "Cancelled";
    }
  }

  dispatch(updateOrder(id, orderData));
};

 const updateCashPaymentHandler = (id) => {

    const formData = new FormData();

    if (cashPayment === "Yes") {

      if (paymentInfo.status === "Cash Paid") {
        formData.set("paymentStatus", "CASH PAID");
      }

      if (paymentInfo.status === "QR Paid") {
        formData.set("paymentStatus", "QR PAID");
      }

    }

    if (cashPayment === "No") {
      formData.set("paymentStatus", "CANCELLED");
      formData.set("status", "Cancelled");
    }

    dispatch(updateOrder(id, formData));
  };

  const shippingDetails =
    shippingInfo &&
    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}`;


  const paymentStatus =
    paymentInfo && paymentInfo.status;

 const isPaid =
    paymentStatus === "succeeded" ||
    paymentStatus === "CASH PAID" ||
    paymentStatus === "QR PAID";

  return (
    <Fragment>
      <MetaData title={`Process Order # {order && order._id}`} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            {loading ? (
              <Loader />
            ) : (
              <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-7 order-details">
                 <h2 className="my-3 my-lg-5 text-break">
                    Order # {order._id}
                  </h2>

                  <h4 className="mb-4">Shipping Info</h4>
                  <p>
                    <b>Name:</b> {user && user.name}
                  </p>
                  <p>
                    <b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}
                  </p>
                  <p>
                    <b>Student ID:</b> {shippingInfo && shippingInfo.postalCode}
                  </p>
                 <p className="mb-4 text-break">
                    <b>Address:</b> {shippingDetails}
                  </p>
                  <p>
                    <b>Amount:</b>
                    RM{totalPrice}
                  </p>

                  <hr />
                  <h4 className="my-4">Payment</h4>

                  <p
                    className={
                      isPaid
                        ? "greenColor"
                        : paymentStatus === "CANCELLED"
                          ? "redColor"
                          : "orangeColor"
                    }
                  >
                    <b>
                      {
                        paymentStatus === "succeeded"
                        ? "PAID"
                        : paymentStatus === "CASH PAID"
                            ? "CASH PAID"
                            : paymentStatus === "QR PAID"
                                ? "QR PAID"
                                : paymentStatus === "CANCELLED"
                                    ? "CANCELLED"
                                    : "NOT PAID"
                      }
                    </b>
                  </p>

                  <hr />
                  <h4 className="my-4">Payment ID</h4>
                  <p>
                    <b>{paymentInfo && paymentInfo.id}</b>
                  </p>

                  <h4 className="my-4">Order Status:</h4>
                  <p
                    className={
                      order.orderStatus &&
                        String(order.orderStatus).includes("Delivered")
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    <b>{orderStatus}</b>
                  </p>

                  <h4 className="my-4">Order Items:</h4>

                  <hr />
                  <div className="cart-item my-1">
                      {orderItems &&
                        orderItems.map((item) => (
                          <div
                            key={item.product}
                            className="row my-3 align-items-center border-bottom pb-3"
                          >
                            <div className="col-4 col-md-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="img-fluid rounded"
                                style={{ maxHeight: "80px" }}
                              />
                            </div>
                    
                            <div className="col-8 col-md-4">
                              <Link
                                to={`/products/${item.product}`}
                                className="text-break"
                              >
                                {item.name}
                              </Link>
                            </div>
                    
                            <div className="col-6 col-md-3 mt-2 mt-md-0">
                              <p className="mb-0">
                                <strong>Price:</strong> RM{item.price}
                              </p>
                            </div>
                    
                            <div className="col-6 col-md-3 mt-2 mt-md-0">
                              <p className="mb-0">
                                <strong>Qty:</strong> {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  <hr />
                </div>

                <div className="col-12 col-lg-4 mt-4 mt-lg-5">
                  <h4 className="my-4">Status</h4>

                  <div className="form-group">
                    <select
                      className="form-control"
                      name="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Order Received">Order Received</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={() => updateOrderHandler(order._id)}
                  >
                    Update Status
                  </button>

                  {
                    paymentInfo &&
                    (
                      paymentInfo.status === "Cash Paid" ||
                      paymentInfo.status === "QR Paid"
                    ) && (

                      <>
                        <div className="form-group mt-4">

                          
                          <h4 className="my-3">
                          {paymentInfo.status === "Cash Paid"
                            ? "Payment via Cash"
                            : paymentInfo.status === "QR Paid"
                              ? "Payment via QR"
                              : ""}
                          </h4>

                          <select
                            className="form-control"
                            value={cashPayment}
                            onChange={(e) => setCashPayment(e.target.value)}
                            disabled={
                            paymentInfo.status === "CASH PAID" ||
                            paymentInfo.status === "QR PAID"
                            } 
                          >

                            <option value="">Select Option</option>

                            <option value="Yes">Yes</option>

                            <option value="No">No</option>

                          </select>

                        </div>

                          <button
                            className="btn btn-success w-100 mt-3"
                            onClick={() => updateCashPaymentHandler(order._id)}
                            disabled={
                              paymentInfo.status === "CASH PAID" ||
                              paymentInfo.status === "QR PAID"
                            }
                          >
                            {
                              paymentInfo.status === "Cash Paid"
                                ? "Update Cash Payment"
                                : "Update QR Payment"
                            }
                          </button>
                      </>
                    )
                  }


                </div>
              </div>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
