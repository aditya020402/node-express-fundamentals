import productvalue from "./products.js";
import Product from "./models/product.js";

const insertvalues = async() => {
    try{
        await Product.deleteMany();
        await Product.create(productvalue);
        console.log("success");
        process.exit(0);
    }
    catch(error){
        console.log(error);
    }
}

export default insertvalues;