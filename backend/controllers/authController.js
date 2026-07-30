//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Auth controller API
//Descrption: Creation of all API's implementing GET, POST, PUT, DELETE
//First written on: 01 July 2023
//Edited on: 30 July 2026

const User = require("../models/user");

const ErrorHandler = require("../utlis/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utlis/jwtToken");
const sendEmail = require("../utlis/sendEmail");

const crypto = require('crypto');
const cloudinary = require('cloudinary');

// Student IDs must start with "SK" followed by 8 digits (10 characters total)
const STUDENT_ID_PATTERN = /^SK\d{8}$/;
// Staff IDs must start with "ST" followed by 6 digits (8 characters total)
const STAFF_ID_PATTERN = /^ST\d{6}$/;
// Basic phone number check - 10 to 11 digits
const PHONE_PATTERN = /^\d{10,11}$/;

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  let avatarData = {};

  if (req.body.avatar) {
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });

    avatarData = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } else {
    avatarData = {
      public_id: 'avatars/default_avatar',
      url: 'https://res.cloudinary.com/dgttsunj5/image/upload/v1698864253/products/s52tmbtqqbwax48qyddc.png',
    };
  }

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
  } = req.body;

  // Validate user type
  if (!userType || !["student", "staff"].includes(userType)) {
    return next(new ErrorHandler("Please select a valid User Type (Student or Staff)", 400));
  }

  const idNumber = userType === "student" ? studentId : staffId;

  // Validate Student ID / Staff ID format
  if (userType === "student" && !STUDENT_ID_PATTERN.test(idNumber)) {
    return next(new ErrorHandler("Invalid Student ID. It must start with 'SK' followed by 8 digits", 400));
  }

  if (userType === "staff" && !STAFF_ID_PATTERN.test(idNumber)) {
    return next(new ErrorHandler("Invalid Staff ID. It must start with 'ST' followed by 6 digits", 400));
  }

  // Validate phone number format
  if (!PHONE_PATTERN.test(phoneNumber)) {
    return next(new ErrorHandler("Please enter a valid phone number", 400));
  }

  if (!course) {
    return next(new ErrorHandler("Please enter your Course (Kursus)", 400));
  }

  if (!level) {
    return next(new ErrorHandler("Please select your Level (Tahap)", 400));
  }

  // --- Duplicate checks: run separately so each gives its own specific message ---

  // Duplicate email
  const duplicateEmail = await User.findOne({ email });
  if (duplicateEmail) {
    return next(new ErrorHandler("This email is already registered.", 400));
  }

  // Duplicate phone number
  const duplicatePhone = await User.findOne({ phoneNumber });
  if (duplicatePhone) {
    return next(new ErrorHandler("This phone number is already registered.", 400));
  }

  // Duplicate Student ID
  if (userType === "student") {
    const duplicateStudentId = await User.findOne({ studentId });
    if (duplicateStudentId) {
      return next(new ErrorHandler("This Student ID is already registered.", 400));
    }
  }

  // Duplicate Staff ID
  if (userType === "staff") {
    const duplicateStaffId = await User.findOne({ staffId });
    if (duplicateStaffId) {
      return next(new ErrorHandler("This Staff ID is already registered.", 400));
    }
  }

  const user = await User.create({
    userType,
    studentId: userType === "student" ? studentId : undefined,
    staffId: userType === "staff" ? staffId : undefined,
    name,
    phoneNumber,
    course,
    level,
    email,
    password,
    avatar: avatarData,
  });

  sendToken(user, 200, res);
});

//Login user => /api/v1/login

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

//Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found  with this email", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email,then ignore it`;

try{

    await sendEmail({
        email: user.email,
        subject:'Cafe KKJ Password Recovery',
        message
    })

    res.status(200).json({
        success: true,
        message: `Email sent to: ${user.email}`
    })

}catch(error){
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500))
}

});

//Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')


    const user = await User.findOne({

        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    })

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler ('Password does not match', 400))
    }

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})


//Get currently logged in user details => /api/v1/me

exports.getUserProfile = catchAsyncErrors(async (req, res, next)=> {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//Update /Change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next)=> {

    const user = await User.findById(req.user.id).select('+password')

    const isMatched = await user.comparePassword(req.body.oldPassword)
    if(!isMatched){
        return next(new ErrorHandler('Old password is incorrect', 400));
    }
    user.password = req.body.password;

    await user.save();
    sendToken(user, 200, res)
})

//update user profile => /api/v1/me/update

exports.updateProfile = catchAsyncErrors(async (req, res, next) =>{

  const newUserData ={
    name: req.body.name,
    email: req.body.email
  }

  if (req.body.avatar) {
    const user = await User.findById(req.user.id)

    const image_id = user.avatar.public_id;
    const resultDestroy = await cloudinary.v2.uploader.destroy(image_id);

    const result = await cloudinary.v2.uploader.upload(req.body.avatar,{

      folder :'avatars',
      width: 150,
      crop: "scale"
    })

    newUserData.avatar ={
      public_id: result.public_id,
      url: result.secure_url
    }

  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {

    new: true,
    runValidators: true,
    useFindAndModify:false
  })

  res.status(200).json({
    success: true
  })


})

//logout user => /api/v1/logout

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

//Admin Routes

//Get All users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async (req, res, next)=>{
  const users = await User.find();

  res.status(200).json({
    success: true,
    users
  })
})

//Get user Details  =>   /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) =>{

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
  }

  res.status(200).json({
    success: true,
    user
  })

})

//update user profile => /api/v1/admin/user/:id

exports.updateUser = catchAsyncErrors(async (req, res, next) =>{

  const newUserData ={
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {

    new: true,
    runValidators: true,
    useFindAndModify:false
  })

  res.status(200).json({
    success: true
  })


})

//Delete user   =>   /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) =>{

  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
  }

  const image_id = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(image_id);

  await user.deleteOne();

  res.status(200).json({
    success: true
  })

})
