import jwt from 'jsonwebtoken'
import { Authrequest } from '../intrerface/interface'
import { NextFunction, Response,Request} from 'express'
import dotenv from 'dotenv'

dotenv.config()

const jwtSecreate=process.env.JWT_SECREATE



export const generateToken=(email:string,userid:string,roles:string):string=>{
 
if(!jwtSecreate){ 
    throw new Error('secreat key not found')
}
return jwt.sign({email,userid,roles},jwtSecreate,{expiresIn:'24h'})
 
}

export const autherizationToken=(req:Authrequest,res:Response,next:NextFunction):void=>{
    try {
        const authheader=req.headers.authorization
        if(!authheader|| !authheader.startsWith('Bearer ')){
            return ;
        }
        const token=authheader.substring(7)  
        console.log('result token',token);
          if(!token){
            console.log('token is not valied');
           res.status(401).json({message:'Access token is required'})
            return;
        }

        const verifyToken=jwt.verify(token,jwtSecreate!)as{
            userid:string;
            email:string;
            roles:string
        }
        if(!verifyToken){
            res.status(404).json({
                message:'not a valied token'
            })
        }
        req.user=verifyToken
        next()
    } catch (error) {
        res.status(500).json({
            message:'error for generate token',
            error
        })
    }
} 