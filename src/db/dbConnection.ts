import mongoose from "mongoose"

export const dbConnection= async():Promise<void>=>{
try {
    const dburl=process.env.MONGODB_URL
    
if(!dburl){
    throw new Error('db url not fount')
}
await mongoose.connect(dburl).then(()=>{console.log('db connected');}).catch(()=>{console.log('db not connected');
        })
} catch (error) {
console.error(error)
}
}