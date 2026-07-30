//Programmer Name: Jagatiswary Mageswaran & Veeshaal Saravanan
//Program Name: Error Handling
//Description: Handling all kinds of errors
//First written on: 16 May, 2026
//Edited on: 30 July, 2026

const ErrorHandler = require("../utlis/errorHandler");

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;

    let error = { ...err };
    error.message = err.message;

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        error = new ErrorHandler(
            `Resource not found. Invalid: ${err.path}`,
            400
        );
    }

    // Validation Error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map(val => val.message)
            .join(", ");

        error = new ErrorHandler(message, 400);
    }

    // Duplicate Key Error
    if (err.code === 11000) {

        const field = Object.keys(err.keyValue)[0];

        let message = "Duplicate value entered.";

        switch (field) {

            case "studentId":
                message = "This Student ID is already registered.";
                break;

            case "staffId":
                message = "This Staff ID is already registered.";
                break;

            case "phoneNumber":
                message = "This Phone Number is already registered.";
                break;

            case "email":
                message = "This Email is already registered.";
                break;

            default:
                message = `Duplicate ${field} entered.`;
        }

        error = new ErrorHandler(message, 400);
    }

    // Wrong JWT
    if (err.name === "JsonWebTokenError") {
        error = new ErrorHandler(
            "JSON Web Token is invalid. Please try again.",
            400
        );
    }

    // Expired JWT
    if (err.name === "TokenExpiredError") {
        error = new ErrorHandler(
            "JSON Web Token has expired. Please login again.",
            400
        );
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
    });

};
