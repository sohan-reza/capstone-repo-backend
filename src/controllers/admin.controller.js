import Teacher from "../models/teacher.model.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


import mongoose from "mongoose";

const createUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { shortName, fullName, educationalMail, defaultPassword } = req.body;

    if (!shortName || !fullName || !educationalMail || !defaultPassword) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    const hashpassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = await User.create([{ 
      username: shortName, 
      email: educationalMail, 
      password: hashpassword, 
      role: 'teacher' 
    }], { session });

    const user = await Teacher.create([{ 
      shortName, 
      fullName, 
      educationalMail, 
      defaultPassword: hashpassword, 
      userId: newUser[0]._id 
    }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: user[0]
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: false,
      message: "Failed to create user",
      error: error.message
    });
  }
};


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await Teacher.find().sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Users retrieved successfully",
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to retrieve users",
      error: error.message
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Teacher.findById(id);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "User not found"
      });
    }

    res.status(StatusCodes.OK).json({
      status: true,
      message: "User retrieved successfully",
      data: user
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to retrieve user",
      error: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const updateFields = req.body;

    const user = await Teacher.findById(id).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (updateFields.defaultPassword) {
      updateFields.defaultPassword = await bcrypt.hash(updateFields.defaultPassword, 10);
      await User.findByIdAndUpdate(user.userId, {
        password: updateFields.defaultPassword
      }, { new: true, session });
    }


    const updatedUser = await Teacher.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
      session
    });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: false,
      message: "Failed to update user",
      error: error.message
    });
  }
};


// Delete user
const deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const user = await Teacher.findById(id).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    await User.findByIdAndDelete(user.userId).session(session);
    await Teacher.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: false,
      message: "Failed to delete user",
      error: error.message
    });
  }
};


export const adminController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
