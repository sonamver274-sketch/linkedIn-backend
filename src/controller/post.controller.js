import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import postModel from "../models/post.model.js"
import notificationModel from "../models/notification.model.js"

const createPost = asyncHandler(async (req, res) => {
  const { content, image } = req.body
  if (!content) throw new ApiError(400, "content is required")

  const post = await postModel.create({
    author: req.user._id,
    content,
    image,
  })

  const populatedPost = await post.populate("author", "name profilePicture headline")
  return res.status(201).json(new ApiResponse(201, { post: populatedPost }, "post created"))
})

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await postModel
    .find()
    .populate("author", "name profilePicture headline")
    .populate("comments.user", "name profilePicture")
    .sort({ createdAt: -1 })

  return res.status(200).json(new ApiResponse(200, { posts }, "posts fetched"))
})

const likePost = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user._id
  const post = await postModel.findById(id)
  if (!post) throw new ApiError(404, "post not found")

  const alreadyLiked = post.likes.includes(userId)
  if (alreadyLiked) {
    await postModel.findByIdAndUpdate(id, { $pull: { likes: userId } })
  } else {
    await postModel.findByIdAndUpdate(id, { $push: { likes: userId } })
    if (post.author.toString() !== userId.toString()) {
      await notificationModel.create({
        recipient: post.author,
        sender: userId,
        type: "like",
        post: post._id
      })
    }
  }

  return res.status(200).json(new ApiResponse(200, {}, alreadyLiked ? "unliked" : "liked"))
})

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params
  const post = await postModel.findById(id)
  if (!post) throw new ApiError(404, "post not found")
  if (post.author.toString() !== req.user._id.toString())
    throw new ApiError(403, "not authorized")

  await postModel.findByIdAndDelete(id)
  return res.status(200).json(new ApiResponse(200, {}, "post deleted"))
})

const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { text } = req.body
  if (!text) throw new ApiError(400, "comment text required")

  const post = await postModel.findByIdAndUpdate(
    id,
    { $push: { comments: { user: req.user._id, text } } },
    { new: true }
  ).populate("comments.user", "name profilePicture")

  if (post.author.toString() !== req.user._id.toString()) {
    await notificationModel.create({
      recipient: post.author,
      sender: req.user._id,
      type: "comment",
      post: post._id
    })
  }

  return res.status(200).json(new ApiResponse(200, { post }, "comment added"))
})

export { createPost, getAllPosts, likePost, deletePost, addComment }
