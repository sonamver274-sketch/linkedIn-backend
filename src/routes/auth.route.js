 import { login , logout, register, getMe } from "../controller/auth.controller.js";
import { verifyJwt } from "../middleware/auth.middlewear.js";

 import express from "express"

 const router = express.Router()

 router.post("/register" , register)
 router.post("/login" , login)
 router.delete("/logout" , verifyJwt , logout)
 router.get("/me" , verifyJwt , getMe)

 export default router