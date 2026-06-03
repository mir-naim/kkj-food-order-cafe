//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Import all routes
//Descrption: Setting up config file and import routes
//First written on: 22 May, 2026
//Edited on:

const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');



const errorMiddleware = require('./middlewares/errors')

//Setting up config file
dotenv.config({path :'backend/config/config.env'})

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(bodyparser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload());


// Import all routes
const products = require('./routes/product');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const order = require('./routes/order');


app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', payment)
app.use('/api/v1', order)


//Middleware to handle errors
app.use(errorMiddleware);


module.exports = app
