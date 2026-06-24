import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const profile = await userModel.findById(id);
  return res
    .status(200)
    .json(new ApiResponse(200, { profile }, "profile showed to user"));
});
const updateProfile = asyncHandler(async (req, res) => {
  const { name, headline, profilePicture } = req.body;
  const id = req.user._id;
  const updateProfile = await userModel.findByIdAndUpdate(
    id,
    { $set: { name, headline, profilePicture } },
    { new: true },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updateProfile }, "profile update sussessfully"),
    );
});
const getAllUsers = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const me = await userModel.findById(myId);

  const users = await userModel.find({ _id: { $ne: myId } }).select("-password");

  const usersWithStatus = users.map((user) => {
    const iAmInTheirConnections = user.connection.some(
      (id) => id.toString() === myId.toString()
    );
    const theyAreInMyConnections = me.connection.some(
      (id) => id.toString() === user._id.toString()
    );

    let connectionStatus = "none";
    if (iAmInTheirConnections && theyAreInMyConnections) {
      connectionStatus = "connected";
    } else if (iAmInTheirConnections && !theyAreInMyConnections) {
      connectionStatus = "sent";
    } else if (!iAmInTheirConnections && theyAreInMyConnections) {
      connectionStatus = "received";
    }

    return { ...user.toObject(), connectionStatus };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { users: usersWithStatus }, "all users fetched"));
});

export {
    getProfile ,
    updateProfile,
    getAllUsers
}
