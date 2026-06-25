import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }
  const user = await userModel.findOne({ email });
  if (user) {
    throw new ApiError(400, "user already exists");
  }
  const hashPassword = await bcrypt.hash(password, 8);
  const newUser = await userModel.create({
    name,
    password: hashPassword,
    email,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, { newUser }, "user registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, "user does not exist");
  }
  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) {
    throw new ApiError(400, "incorrect password");
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return res
    .status(200)
    .cookie("token", token, { httpOnly: true })
    .json(new ApiResponse(200, { user }, "user login sussessfully"));
});
const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("token")
    .json(new ApiResponse(200, {}, "logout sussessfully"));
});
const getMe = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "current user fetched"));
});

export { login, logout, register, getMe };
