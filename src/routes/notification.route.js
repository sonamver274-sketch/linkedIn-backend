import express from "express"
import { getNotifications, markAllRead } from "../controller/notification.controller.js"
import { verifyJwt } from "../middleware/auth.middlewear.js"

const router = express.Router()

router.get("/", verifyJwt, getNotifications)
router.put("/read", verifyJwt, markAllRead)

export default router
