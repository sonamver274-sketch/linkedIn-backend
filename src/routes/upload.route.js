import express from "express"
import { uploadImage } from "../controller/upload.controller.js"
import { verifyJwt } from "../middleware/auth.middlewear.js"
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()

router.post("/", verifyJwt, upload.single("image"), uploadImage)

export default router
