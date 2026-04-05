import { Request } from "express"

export interface user{
name:string,
email:string,
password:string,
roles:string
}

export interface userRequestLogin{

email:string,
password:string
}

export interface userResponse{
_id?:string,
name:string,
email:string,
roles:string
}



export interface Authrequest extends Request{
    user?:{
        userid:string,
        email:string,
        roles:string
    }
}