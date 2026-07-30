//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Register page
//Descrption: Register for new user by entering valid info
//First written on: 07 May, 2026
//Edited on: 30 July 2026

import React, { Fragment, useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import MetaData from "../layout/MetaData";
import { register, clearErrors } from "..//../actions/userActions";

const Register = () => {
  const [user, setUser] = useState({
    userType: "",
    studentId: "",
    staffId: "",
    name: "",
    phoneNumber: "",
    course: "",
    level: "",
    email: "",
    password: "",
  });

  const {
    userType,
    studentId,
    staffId,
    name,
    phoneNumber,
    course,
    level,
    email,
    password,
  } = user;

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.png"
  );

  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, isAuthenticated, error, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!userType) {
      alert.error("Please select a User Type (Student or Staff)");
      return;
    }

    if (userType === "student" && !/^SK\d{8}$/.test(studentId)) {
      alert.error("Student ID must start with 'SK' followed by 8 digits");
      return;
    }

    if (userType === "staff" && !/^ST\d{6}$/.test(staffId)) {
      alert.error("Staff ID must start with 'ST' followed by 6 digits");
      return;
    }

    if (!/^\d{10,11}$/.test(phoneNumber)) {
      alert.error("Please enter a valid phone number (10-11 digits)");
      return;
    }

    // Password validation pattern: at least 6 characters, at least one letter, one number, and one special character
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;

    if (!passwordPattern.test(password)) {
      alert.error(
        "Password must be at least 6 characters and contain at least one letter, one number, and one special character"
      );
      return;
    }

    const formData = new FormData();
    formData.set("userType", userType);
    if (userType === "student") formData.set("studentId", studentId);
    if (userType === "staff") formData.set("staffId", staffId);
    formData.set("name", name);
    formData.set("phoneNumber", phoneNumber);
    formData.set("course", course);
    formData.set("level", level);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("avatar", avatar);

    dispatch(register(formData));
  };

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <Fragment>
      <MetaData title={"Register User"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <h1 className="mb-3">Register</h1>

            <div className="form-group">
              <label htmlFor="userType_field">User Type</label>
              <select
                id="userType_field"
                className="form-control"
                name="userType"
                value={userType}
                onChange={onChange}
              >
                <option value="">-- Select User Type --</option>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            {userType === "student" && (
              <div className="form-group">
                <label htmlFor="studentId_field">Student ID</label>
                <input
                  type="text"
                  id="studentId_field"
                  className="form-control"
                  name="studentId"
                  placeholder="SK12345678"
                  value={studentId}
                  onChange={onChange}
                />
              </div>
            )}

            {userType === "staff" && (
              <div className="form-group">
                <label htmlFor="staffId_field">Staff ID</label>
                <input
                  type="text"
                  id="staffId_field"
                  className="form-control"
                  name="staffId"
                  placeholder="ST123456"
                  value={staffId}
                  onChange={onChange}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber_field">Phone Number</label>
              <input
                type="text"
                id="phoneNumber_field"
                className="form-control"
                name="phoneNumber"
                placeholder="0123456789"
                value={phoneNumber}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="course_field">Course (Kursus)</label>
              <input
                type="text"
                id="course_field"
                className="form-control"
                name="course"
                value={course}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="level_field">Level (Tahap)</label>
              <input
                type="text"
                id="level_field"
                className="form-control"
                name="level"
                value={level}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img
                      src={avatarPreview}
                      className="rounded-circle"
                      alt="Avatar Preview"
                    />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    className="custom-file-input"
                    id="customFile"
                    accept="images/*"
                    onChange={onChange}
                  />
                  <label className="custom-file-label" for="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn btn-block py-3"
              disabled={loading ? true : false}
            >
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
