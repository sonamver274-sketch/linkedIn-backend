import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const verifyJwt = asyncHandler(async(req,res,next)=>{
    const token = req.cookies.token
    if (!token) {
        throw new ApiError(404,"unauthorized token")
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.id)
    if (!user) {
        throw new ApiError(404,"unauthorized user")
    }
    req.user = user
    next()
})