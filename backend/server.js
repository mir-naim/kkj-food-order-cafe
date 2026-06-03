//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Server connection
//Descrption: Connect with mongodb database and setting cloudnary
//First written on: 23 July 2023
//Edited on:


const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');
const cloudinary = require('cloudinary');

//Handle Unncaught exceptions
process.on('uncaughtException', err=>{
    console.log(`Error: ${err.stack}`);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1)
})



//Setting up config file

const path = require('path');
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });


// Connecting to database
connectDatabase();


//setting up cloudnary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// 👇 ADD THIS HERE
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend Running",
  });
});

app.set("trust proxy", 1);

const server = app.listen(process.env.PORT,() =>{
    console.log(`Server stated on PORT : ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)

})

//Handle UnHandledPromise rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.stack}`);
    console.log('Shutting down the server due to Unhandled Promise rejection');
    server.close(() =>{
        process.exit(1)
    })

})
