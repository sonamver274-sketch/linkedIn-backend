 import { getProfile , updateProfile, getAllUsers } from "../controller/user.controller.js";
 import { verifyJwt } from "../middleware/auth.middlewear.js";
 import express from "express"

 const router = express.Router()

 router.get("/profile/:id" ,verifyJwt, getProfile)
 router.post("/profile/update" , verifyJwt , updateProfile)
 router.get("/all" , verifyJwt , getAllUsers)

 export default router