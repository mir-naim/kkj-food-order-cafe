//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: New Password page
//Descrption: Request for new password
//First written on: 24 May, 2026
//Edited on: 28 May, 2026


import React, { Fragment, useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"; // Import useParams to access route parameters

import MetaData from "../layout/MetaData";
import { resetPassword, clearErrors } from "..//../actions/userActions";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use the useParams hook to access route parameters
  const { token } = useParams();

  const { error, success } = useSelector((state) => state.forgotPassword);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password Updated Successfully");
      navigate("/login");
    }
  }, [dispatch, alert, error, success, navigate]);

  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/; //Updated this line to validate user input

  const submitHandler = (e) => {
    e.preventDefault();

    //Validate password 
    if (!passwordPattern.test(password)) {
      alert.error(
        "Password must be at least 6 characters and contain at least one letter, one number, and one special character"
      );
      return;
    }

    const formData = new FormData();
    formData.set("password", password);
    formData.set("confirmPassword", confirmPassword);

    dispatch(resetPassword(token, formData)) // Use the token obtained from useParams
  };

  return (
    <Fragment>
      <MetaData title={"New Password Reset"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-3">New Password</h1>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm_password_field">Confirm Password</label>
              <input
                type="password"
                id="confirm_password_field"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              id="new_password_button"
              type="submit"
              className="btn btn-block py-3"
            >
              Set Password
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewPassword;
