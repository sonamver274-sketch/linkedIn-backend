 import mongoose from "mongoose";

 
  
 const mongoDb = async()=>{
    try {
      await  mongoose.connect(process.env.MONGODB_URI) 
    } catch (error) {
        console.log(error);
         process.exit()
    }
 }
 
 export default mongoDb