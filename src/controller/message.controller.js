import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import messageModel from "../models/message.model.js"
import userModel from "../models/user.model.js"

const sendMessage = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { text } = req.body
  if (!text) throw new ApiError(400, "text required")

  const message = await messageModel.create({
    sender: req.user._id,
    recipient: id,
    text
  })

  return res.status(201).json(new ApiResponse(201, { message }, "message sent"))
})

const getConversation = asyncHandler(async (req, res) => {
  const { id } = req.params
  const myId = req.user._id

  const messages = await messageModel
    .find({
      $or: [
        { sender: myId, recipient: id },
        { sender: id, recipient: myId }
      ]
    })
    .sort({ createdAt: 1 })

  await messageModel.updateMany(
    { sender: id, recipient: myId, read: false },
    { $set: { read: true } }
  )

  return res.status(200).json(new ApiResponse(200, { messages }, "conversation fetched"))
})

const getConnectedUsers = asyncHandler(async (req, res) => {
  const user = await userModel
    .findById(req.user._id)
    .populate("connection", "name profilePicture headline")

  return res.status(200).json(new ApiResponse(200, { users: user.connection }, "connected users fetched"))
})

export { sendMessage, getConversation, getConnectedUsers }
