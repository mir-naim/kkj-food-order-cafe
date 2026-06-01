//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Order page 
//Descrption: After successfuly make payment, it will be shown success payment page
//First written on: 30 September, 2023
//Edited on:


import React from "react";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="container container-fluid">
      <MetaData title={"Order Success"} />
      <div className="row justify-content-center">
        <div className="col-6 mt-5 text-center">
          <img
            className="my-5 img-fluid d-block mx-auto"
            src="https://freepngimg.com/thumb/success/6-2-success-png-image.png"
            alt="Order Success"
            width="200"
            height="200"
          />

          <h2>Your Order has been placed successfully.</h2>
          <p>Please collect your food from the café counter.</p>

          <Link to="/orders/me">Go to Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
