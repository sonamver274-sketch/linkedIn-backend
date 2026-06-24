import express from "express"
import { createJob, getAllJobs, applyJob, deleteJob } from "../controller/job.controller.js"
import { verifyJwt } from "../middleware/auth.middlewear.js"

const router = express.Router()

router.get("/all", verifyJwt, getAllJobs)
router.post("/create", verifyJwt, createJob)
router.put("/apply/:id", verifyJwt, applyJob)
router.delete("/delete/:id", verifyJwt, deleteJob)

export default router
