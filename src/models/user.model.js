import mongoose, { Schema } from "mongoose";

const userSchema= new Schema(
    {
        name:{
            type:String,
            required:true,
            
        },
        email:{
            type:String,
            required:true,
            unique:true,
          
        },
        password:{
            type:String,
            required:true,
           
        },
        profilePicture:{
            type:String
        }
        ,
        headline:{
            type:String
        },
        connection:[{
            type:mongoose.Schema.Types.ObjectId , ref:"User"
        }]
    }
)

export default mongoose.model("User",userSchema)