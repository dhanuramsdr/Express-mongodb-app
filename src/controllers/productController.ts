import { Request, Response } from "express";
import { Product } from "../intrerface/productInterface";
import { productModels } from "../models/productModels";

export const addProduct=async(req:Request,res:Response):Promise<void>=>{
    try {
        const{name,quantity,categorey,sellerid}:Product=req.body
        if(!name || !quantity ||!categorey ||!sellerid){
        res.status(400).json({ message: "All required fields must be provided" });
        return ;
        }
        const result=await productModels.create({
            Productname:name,
            Productquantity:quantity,
            categorey:categorey,
            seller:sellerid
        })
        if(!result){
    res.status(404).json({
        message:'unable to create product'
    })
}
    res.status(200).json({
        message:'product created successfully'
    })
    } catch (error) {
  console.log(error);    
     res.status(500).json({
        message:'unhandled network error'
    })      
    }
} 
