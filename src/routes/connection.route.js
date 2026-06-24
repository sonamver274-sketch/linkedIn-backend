  import { sendRequest , acceptRequest , removeRequest } from "../controller/connection.controller.js";
  import { verifyJwt } from "../middleware/auth.middlewear.js";
  import express from "express"
 
  const router = express.Router()
 
  router.put("/send/:id" , verifyJwt ,sendRequest )
  router.put("/accept/:id" , verifyJwt , acceptRequest)
  router.put("/remove/:id" , verifyJwt,removeRequest)

  export default router