import mongoose from "mongoose";

const producSchema=new mongoose.Schema({
    Productname:{
        type:String,
        required:[true,"Productname is  required"]
    },
    Productquantity:{
       type:Number,
       required:[true,"Productquantity is  required"]         
    },
    ProductUrl:[{
        type:String,
    }],
    categorey:{
        type:String,
        require:[true,"Productcategorey is  required"],
        enum:{
            values:[
                 'Electronics',
                 'Mobile',
                 'Toyes'
            ]
        }

    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,"Sellerid is  required"]   
    }
})

export const productModels=mongoose.model('product',producSchema)