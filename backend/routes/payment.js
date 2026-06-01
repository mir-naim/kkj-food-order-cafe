//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Payment router
//Descrption: Connect payment router
//First written on: 30 May, 2026
//Edited on:


const express = require("express");
const router = express.Router();

const {
  processPayment,
  sendStripeApi
} = require("../controllers/paymentController");

const { isAuthenticatedUser} = require("../middlewares/auth");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/stripeapi").get(isAuthenticatedUser, sendStripeApi);



module.exports = router;
