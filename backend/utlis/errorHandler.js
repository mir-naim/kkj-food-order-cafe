//Programmer Name: Jagatiswary Mageswaran & Veeshaal Saravanan
//Program Name: Custom Error Handler
//Description: Custom error handler class
//First written on: 16 May, 2026
//Edited on: 30 July, 2026

class ErrorHandler extends Error {

    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }

}

module.exports = ErrorHandler;
