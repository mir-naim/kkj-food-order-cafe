//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Footer Page
//Descrption: Footer will be shown developer details
//First written on: 
//Edited on:

import React, { Fragment } from "react";

const Footer = () => {
  return (
    <Fragment>
      <footer className="text-white text-center text-lg-start bg-dark mb-1">
        <div className="container-fluid p-2 w-100">
          <div className="row mt-4">
            <div className="col-lg-4 col-md-12 mb-md-0">
              <h5 className="text-uppercase">About Us</h5>
              <div>
                <br />
                <p>
                  Cafe KKJ is a food ordering website enhances dining at College Name through fast, technology-driven food ordering solutions. It streamlines order processing, reduces wait times, and improves customer satisfaction.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h5 className="text-uppercase mb-4 pb-1">Address</h5>

              <ul className="list-unstyled">
                <li className="mb-3">
                  <i className="fas fa-home me-2"></i>Jalan Teknologi 5, Taman
                  Teknologi Malaysia, 57000 Kuala Lumpur, Wilayah Persekutuan
                  Kuala Lumpur
                </li>
                <li className="mb-3">
                  <i className="fas fa-envelope me-2"></i>
                  contact@cafekkj.com
                </li>
                <li className="mb-3">
                  <i className="fas fa-phone me-2"></i>+60 146 566 000
                </li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h5 className="text-uppercase mb-4">Opening hours</h5>

              <table className="table text-center text-white">
                <tbody className="fw-normal">
                  <tr>
                    <td>Mon - Thu:</td>
                    <td>8am - 9pm</td>
                  </tr>
                  <tr>
                    <td>Fri - Sat:</td>
                    <td>8am - 5pm</td>
                  </tr>
                  <tr>
                    <td>Sunday:</td>
                    <td>Closed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </footer>
      <footer
        className="py-1"
        style={{
          width: "80%", // Set your desired width (e.g., 80%)
          margin: "20px auto", // Add margin to create space above
          textAlign: "center", // Center the content
        }}
      >
        <p className="text-center mt-1">
          Developed By Jagatiswary mageswaran & Veeshaal saravanan. All Rights Reserved.
        </p>
      </footer>
    </Fragment>
  );
};

export default Footer;
