 import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import notificationModel from "../models/notification.model.js";

const sendRequest = asyncHandler(async(req , res )=>{
 const {id}=req.params 
  const userid = req.user.id 
 const checkConnection = await userModel.findById(id)
 if ( checkConnection.connection.includes(userid)) {
    throw new ApiError(404,"connection alredy done ")
 }

 const newConnection = await userModel.findByIdAndUpdate(id , {$push:{connection: userid}} , {new:true})

 await notificationModel.create({
   recipient: id,
   sender: userid,
   type: "connection_request"
 })

 return  res
 .status(201)
 .json(
    new ApiResponse(201,{newConnection},"request send done")
 )
})
const acceptRequest = asyncHandler(async(req , res )=>{
    const {id}=req.params
    const myId = req.user.id
    // sendRequest ne already requester ka ID mere array mein daal diya tha
    // ab sirf requester ke array mein mera ID daalna hai
    await userModel.findByIdAndUpdate(id,{$push:{connection: myId}})
 return  res
 .status(200)
 .json(
    new ApiResponse(200,{},"request accepted")
 )
})
const removeRequest = asyncHandler(async(req , res )=>{
     const {id}=req.params 
    const myId = req.user.id 
    await userModel.findByIdAndUpdate(id,{$pull:{connection: myId}})
     await userModel.findByIdAndUpdate(myId,{$pull:{connection: id}})
 return  res
 .status(200)
 .json(
    new ApiResponse(200,{},"connection removed")
 )
})

export {sendRequest,acceptRequest,removeRequest}