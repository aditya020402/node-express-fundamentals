import Product from "../models/Product.js";
import StatusCodes from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import {dirname} from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname =  dirname(__filename);

export const createProduct = async(req,res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product});
};


export const getAllProducts = async(req,res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({products,count:products.length});
};

export const getSingleProduct = async(req,res) => {
    const {id:productId} = req.params;
    const product = await Product.findOne({_id:productId}).populate('reviews');
    if(!product){
        throw new NotFoundError(`No product was found with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({product});
};

export const updateProduct = async(req,res) => {
    const {id:productId} = req.params;
    const product = await Product.findOneAndUpdate({_id:productId},req.body,{
        new:true,
        runValidator:true,
    });
    if(!product){
        throw new NotFoundError(`No product was id ${productId}`);
    }

}

export const deleteProduct = async(req,res) => {
    const {id:productId} = req.params;
    const product = await Product.findOne({_id:productId});
    if(!product){
        throw new NotFoundError(`No product with id ${productId}`);
    }
    await product.remove();
    res.status(StatusCodes.OK).json({msg:'Success! Product removed'});
};

export const uploadImage = async(req,res) => {
    if(!res.files){
        throw new BadRequestError("No file uploaded");
    }
    const productImage = req.files.image;
    if(!productImage.mimetype.startsWith('image')){
        throw new BadRequestError("please upload a image");
    }
    const maxsize = 1024*1024;

    if(productImage.size>maxsize){
        throw new BadRequestError('Please upload a image with size smaller than 1MB');
    }

    const imagePath = path.join(__dirname,'../public/uploads/'+`${productImage.name}`);

    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({image:`/uploads/${productImage.name}`});

}

