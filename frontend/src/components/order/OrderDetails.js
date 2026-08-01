//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Order details page
//Descrption: Order details can be seen by clicking eye button beside order item
//First written on: 10 September, 2023
//Edited on:


import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader";
import { useParams } from "react-router-dom";

import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getOrderDetails } from "../../actions/orderActions";

const OrderDetails = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the 'id' parameter from the route using useParams

  const { loading, error, order } = useSelector(state => state.orderDetails);
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus
  } = order || {};

  useEffect(() => {
    dispatch(getOrderDetails(id));

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error, id]);

  const shippingDetails =
    shippingInfo &&
    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}`;

  const isPaid =
  paymentInfo &&
  (
    paymentInfo.status === "succeeded" ||
    paymentInfo.status === "CASH PAID" ||
    paymentInfo.status === "QR PAID"
  );

  return (
    <Fragment>
      <MetaData title={"Order Details"} />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="container">
            <div className="row">
              <div className="col-12 mt-3 mt-lg-5 order-details">
              <h3 className="my-3 my-lg-5 text-break">
                Order # {order._id}
              </h3>

              <h4 className="mb-4">User Info</h4>
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
                <b>Amount:</b> RM{totalPrice}
              </p>

              <hr />

              <h4 className="my-4">Payment</h4>
              <p className={isPaid ? "greenColor" : "redColor"}>
                <b>
                  {paymentInfo?.status === "succeeded"
                  ? "PAID"
                  : paymentInfo?.status === "CASH PAID"
                  ? "CASH PAID"
                  : paymentInfo?.status === "QR PAID"
                  ? "QR PAID"
                  : paymentInfo?.status === "CANCELLED"
                  ? "CANCELLED"
                  : "NOT PAID"}
              </b>
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
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;
