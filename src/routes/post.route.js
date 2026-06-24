import express from "express"
import { createPost, getAllPosts, likePost, deletePost, addComment } from "../controller/post.controller.js"
import { verifyJwt } from "../middleware/auth.middlewear.js"

const router = express.Router()

router.post("/create", verifyJwt, createPost)
router.get("/all", verifyJwt, getAllPosts)
router.put("/like/:id", verifyJwt, likePost)
router.delete("/delete/:id", verifyJwt, deletePost)
router.post("/comment/:id", verifyJwt, addComment)

export default router
