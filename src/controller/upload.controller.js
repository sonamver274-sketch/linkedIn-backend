import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded")

  const result = await uploadToCloudinary(req.file.buffer)

  return res
    .status(200)
    .json(new ApiResponse(200, { url: result.secure_url }, "image uploaded"))
})

export { uploadImage }
