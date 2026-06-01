//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Authenticate Middleware
//Descrption: User authentication process
//First written on: 15 July 2023
//Edited on:



const User = require('../models/user')

const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utlis/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

//Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async(req, res, next) =>{

    const {token} = req.cookies
    if(!token){
        return next(new ErrorHandler('Login first to access this resource', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    next()
})

//Handling user roles
exports.authorizeRoles = (...roles) =>{
    return (req,res,next) =>{
        if(! roles.includes(req.user.role)){
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403))
        }
        next()
    }
}