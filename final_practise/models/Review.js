import mongoose from "mongoose";

const schema = new mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,'please provide rating'],
    },
    title:{
        type:String,
        trim:true,
        required:[true,'please provide review title'],
        maxlemgth:100,
    },
    comment:{
        type:String,
        required:[true,'please provide review text'],
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require:true,
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:true,
    },
},
{timestamps:true},
);

schema.index({product:1,user:1},{unique:true});

//static methods are methods that are called without object. they are called using the model and not the object 

schema.statics.calculateAverageRating = async function(productId){
    const result = await this.aggregate([
        {$match:{product:productId}},
        {$group:{
            _id:null,
            averageRating:{$avg:'$rating'},
            numOfReviews:{$sum:1},
        }},
    ]);
    try{
        await this.model('Product').findOneAndUpdate({_id:productId},
        {averageRating:Math.ceil(result[0]?.averageRating||0),
        numOfReviews:result[0]?.numOfReviews||0 ,
        }
        );
    }
    catch(error){
        console.log(error);
    }
}

// this.constructor refers to the model that was used to create this object.
schema.post('save',async function(){
    await this.constructor.calculateAverageRating(this.product);
});

schema.post('remove',async function(){
    await this.constructor.calculateAverageRating(this.product);
});


const Review = mongoose.model("reviews",schema);

export default Review;