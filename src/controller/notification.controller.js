import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/apiResponse.js"
import notificationModel from "../models/notification.model.js"

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationModel
    .find({ recipient: req.user._id })
    .populate("sender", "name profilePicture")
    .populate("post", "content")
    .sort({ createdAt: -1 })

  return res.status(200).json(new ApiResponse(200, { notifications }, "notifications fetched"))
})

const markAllRead = asyncHandler(async (req, res) => {
  await notificationModel.updateMany(
    { recipient: req.user._id, read: false },
    { $set: { read: true } }
  )
  return res.status(200).json(new ApiResponse(200, {}, "marked as read"))
})

export { getNotifications, markAllRead }
