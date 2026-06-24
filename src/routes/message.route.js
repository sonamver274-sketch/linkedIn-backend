import express from "express"
import { sendMessage, getConversation, getConnectedUsers } from "../controller/message.controller.js"
import { verifyJwt } from "../middleware/auth.middlewear.js"

const router = express.Router()

router.get("/connections", verifyJwt, getConnectedUsers)
router.post("/send/:id", verifyJwt, sendMessage)
router.get("/:id", verifyJwt, getConversation)

export default router
