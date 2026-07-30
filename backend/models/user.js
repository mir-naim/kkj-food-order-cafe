//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: User schema
//Descrption: Define user database schema
//First written on: 20 May, 2026
//Edited on: 30 July 2026


const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    userType:{
        type: String,
        required: [true, 'Please select a User Type'],
        enum: {
            values: ['student', 'staff'],
            message: 'User Type must be either student or staff'
        }
    },
    studentId:{
        type: String,
        unique: true,
        sparse: true, // allows many docs with no studentId (staff users) without violating uniqueness
        match: [/^SK\d{8}$/, "Student ID must start with 'SK' followed by 8 digits"]
    },
    staffId:{
        type: String,
        unique: true,
        sparse: true, // allows many docs with no staffId (student users) without violating uniqueness
        match: [/^ST\d{6}$/, "Staff ID must start with 'ST' followed by 6 digits"]
    },
    name:{
        type: String,
        required: [true, 'Please enter your name'],
        maxLength:[30, 'Your name cannot exceed 30 charecters']
    },
    phoneNumber:{
        type: String,
        required: [true, 'Please enter your phone number'],
        unique: true,
        match: [/^\d{10,11}$/, 'Please enter a valid phone number']
    },
    course:{
        type: String,
        required: [true, 'Please enter your Course (Kursus)']
    },
    level:{
        type: String,
        required: [true, 'Please select your Level (Tahap)']
    },
    email:{
        type: String,
        required: [true, 'Please enter your email'],
        unique:true,
        validate:[validator.isEmail, 'Please enter valid email address']

    },
    password:{
        type: String,
        required:[true, 'Please enter your password'],
        minlength:[6, 'Your password must be longer than 6 characters'],
        select:false
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: 'user'
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

//Encrypting password before saving user

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//Compare user password
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}



//Return JWT token

userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}



//Genrate password reset token

userSchema.methods.getResetPasswordToken = function(){
    //Generate token

    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    //set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken
}

module.exports = mongoose.model('User', userSchema)
