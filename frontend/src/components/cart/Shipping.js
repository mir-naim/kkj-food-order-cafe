//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Shipping page
//Descrption: In this page , Shipping details need to enter to process order
//First written on: 1 October, 2023
//Edited on: 28 May, 2026 (Remove all countries except Malaysia)

import React, { Fragment, useState } from "react";
//import { Link } from "react-router-dom";
//import { countries } from "countries-list";

//Add all country list on the option to select [If this website works multiple countries]
//{countriesList.map(country => (
// Mapping through the countriesList and creating an option for each country
//<option key={country.name} value={country.name}>
//{country.name}
//</option>
//))}

import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../actions/cartActions";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./CheckoutSteps";

const Shipping = () => {
  //const countriesList = Object.values(countries); //Edited because we want only Malaysia default selected

  const { shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Use useNavigate to get the navigation function instead of history

  const [name] = useState(user ? user.name : "");

  const [phoneNo, setPhoneNo] = useState(
    user ? user.phoneNumber : shippingInfo.phoneNo
  );

  const [userId] = useState(
    user
      ? (user.studentId || user.staffId || "")
      : ""
  );
  const dispatch = useDispatch();


  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      saveShippingInfo({
        name,
        phoneNo,
        userId,
      })
    );

    navigate("/order/confirm");
  };

  return (
    <Fragment>
      <MetaData title={"User Info"} />
      <CheckoutSteps shipping />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">User Info</h1>




            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                value={name}
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_field">Phone Number</label>
              <input
                type="text"
                id="phone_field"
                className="form-control"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>


            <div className="form-group">
              <label htmlFor="userid_field">
                Student ID / Staff ID
              </label>

              <input
                type="text"
                id="userid_field"
                className="form-control"
                value={userId}
                readOnly
              />
            </div>


            <button
              id="shipping_btn"
              type="submit"
              className="btn btn-block py-3"
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
