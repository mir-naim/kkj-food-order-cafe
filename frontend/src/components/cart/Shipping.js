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
  const navigate = useNavigate(); // Use useNavigate to get the navigation function instead of history

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
  const [country, setCountry] = useState("Malaysia"); //Make malaysia default instead of shippingInfo.country

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country }));
    navigate("/order/confirm"); // Use navigate to redirect
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
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city_field">City</label>
              <input
                type="text"
                id="city_field"
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_field">Phone No</label>
              <input
                type="phone"
                id="phone_field"
                className="form-control"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="postal_code_field">Student ID</label>
              <input
                type="text"
                id="postal_code_field"
                className="form-control"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="country_field">Country</label>
              <select
                id="country_field"
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                disabled // disable the dropdown so users can't change it
              >
                <option key="Malaysia" value="Malaysia">
                  Malaysia
                </option>
              </select>
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
