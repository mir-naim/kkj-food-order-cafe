//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Error Handler Class
//Descrption: Error Handler Class
//First written on: 30 May, 2026
//Edited on:

//Error Handler Class
class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
    }
}


module.exports = ErrorHandler;