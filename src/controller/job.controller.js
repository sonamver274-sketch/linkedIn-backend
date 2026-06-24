import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jobModel from "../models/job.model.js"

const createJob = asyncHandler(async (req, res) => {
  const { title, company, location, description, type } = req.body
  if (!title || !company || !location || !description) {
    throw new ApiError(400, "All fields are required")
  }

  const job = await jobModel.create({
    title, company, location, description, type,
    postedBy: req.user._id
  })

  const populated = await job.populate("postedBy", "name profilePicture")
  return res.status(201).json(new ApiResponse(201, { job: populated }, "job posted"))
})

const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await jobModel
    .find()
    .populate("postedBy", "name profilePicture")
    .sort({ createdAt: -1 })

  return res.status(200).json(new ApiResponse(200, { jobs }, "jobs fetched"))
})

const applyJob = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user._id

  const job = await jobModel.findById(id)
  if (!job) throw new ApiError(404, "job not found")

  const alreadyApplied = job.applicants.includes(userId)
  if (alreadyApplied) {
    await jobModel.findByIdAndUpdate(id, { $pull: { applicants: userId } })
    return res.status(200).json(new ApiResponse(200, {}, "application withdrawn"))
  }

  await jobModel.findByIdAndUpdate(id, { $push: { applicants: userId } })
  return res.status(200).json(new ApiResponse(200, {}, "applied successfully"))
})

const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params
  const job = await jobModel.findById(id)
  if (!job) throw new ApiError(404, "job not found")
  if (job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "not authorized")
  }
  await jobModel.findByIdAndDelete(id)
  return res.status(200).json(new ApiResponse(200, {}, "job deleted"))
})

export { createJob, getAllJobs, applyJob, deleteJob }
