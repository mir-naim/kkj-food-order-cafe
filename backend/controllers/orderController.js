//Programmer Name: Jagatiswary mageswaran & Veeshaal saravanan
//Program Name: Order Controller
//Descrption: All Orders controller
//First written on: 02 July 2023
//Edited on:

const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utlis/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//Created a new order => /api/v1/order/new

exports.newOrder = catchAsyncErrors(async (req, res, next)=>{
    const{
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;


    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
})

//Get single order => /api/v1/order/:id

exports.getSingleOrder = catchAsyncErrors(async (req, res, next)=>{

    const order = await Order.findById(req.params.id).populate('user','name email')

    if(!order){
        return next(new ErrorHandler('No order found with this ID', 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})


//Get logged in user orders => /api/v1/orders/me

exports.myOrders = catchAsyncErrors(async (req, res, next)=>{

    const orders = await Order.find({user: req.user.id})


    res.status(200).json({
        success: true,
        orders
    })
})


//Get all orders => /api/v1/admin/orders

exports.allOrders = catchAsyncErrors(async (req, res, next)=>{

    const orders = await Order.find()

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})


//Update / Process order - ADMIN/STAFF => /api/v1/admin/order/:id

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400));
    }

    // FIXED: proper async handling
    for (const item of order.orderItems) {
        await updateStock(item.product, item.quantity);
    }

    if (req.body.paymentStatus) {
        order.paymentInfo.status = req.body.paymentStatus;
    }

    if (req.body.status) {
        order.orderStatus = req.body.status;
    }

    if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
        success: true,
        order
    });
});

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({validateBeforeSave: false})
}


//Delete order => /api/v1/admin/order/:id

exports.deleteOrder = catchAsyncErrors(async (req, res, next)=>{

    const order = await Order.findById(req.params.id).populate('user','name email')

    if(!order){
        return next(new ErrorHandler('No order found with this ID', 404))
    }

    await order.deleteOne();

    res.status(200).json({
        success: true
    })
})
