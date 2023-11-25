import Order from "../models/Order.js";
import Product from "../models/Product.js"
import StatusCodes from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import { checkPermissions } from "../utils/index.js";


export const fakeStripeAPI = async({amount,currency}) => {
    const client_secret = 'someRandomValueforStripe';
    return {client_secret,amount};
}

export const createOrder = async(req,res) => {
    const {items:cartItems,tax,shippingFee} = req.body;
    if(!cartItems || !cartItems.length<1){
        throw new BadRequestError('No cart items provided');
    }
    if(!tax || !shippingFee){
        throw new BadRequestError('Please provide tax and shipping fee');
    }
    let orderItems = [];
    let subTotal = 0;
    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id:item.product});
        if(!dbProduct){
            throw new NotFoundError(`No product with id : ${item.product}`);
        }
        const {name,price,image,_id} = dbProduct;
        const singleOrderItem = {
            amount:item.amount,
            name,
            price,
            image,
            product:_id,
        }
        orderItems = [...orderItems,singleOrderItem];
        subTotal += item.amount*price;
    }
    const total = tax+shippingFee+subTotal;
    const paymentIntent = await fakeStripeAPI({amount:total,currency:"usd"});
    const order = await Order.create({
        orderItems,
        total,
        subTotal,
        tax,
        shippingFee,
        clientSecret:paymentIntent.client_secret,
        user:req.user.userId,
    });
    res.status(StatusCodes.CREATED).json({order,clientSecret:order.clientSecret});
}



export const getAllOrders = async(req,res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({orders,count:orders.length});
}

export const getSingleOrder = async(req,res) => {
    const {id:orderId} = req.params;
    const order = await Order.findOne({_id:orderId});
    if(!order){
        throw new NotFoundError(`No order with id: ${orderId}`);
    }
    checkPermissions(req.user,order.user);
    res.status(StatusCodes.OK).json({order});
}

export const getCurrentUserOrders = async(req,res) => {
    const orders = await Order.find({user:req.user.userId});
    res.status(StatusCodes.OK).json({orders,count:orders.length});
}

export const updateOrder = async(req,res) => {
    const {id:orderId} = req.params;
    const {paymentIntentId} = req.body;
    const order = await Order.findOne({_id:orderId});
    if(!order){
        throw new NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermissions(req.user,order.user);
    order.paymentIntentId = paymentIntentId;
    order.status = "paid";
    await order.save();
    res.status(StatusCodes.OK).json({order});
}