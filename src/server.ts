import express, { Request, Response } from 'express'
import cors from 'cors'
import dot from 'dotenv'
import { dbConnection } from './db/dbConnection'
import { allRouter } from './router/allRouter'
dot.config()
const app=express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/v1',allRouter)

app.get('/test',(resq:Request,res:Response)=>{
    res.status(200).json({
        message:'test server ok'
    })
})

const startServer=async():Promise<void>=>{
    try {

        await dbConnection()

        app.listen(process.env.PORT,()=>{
            console.log('server start');
        })
    } catch (error) {
        console.error(error);
    }
}

startServer()