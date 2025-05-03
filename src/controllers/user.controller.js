import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import validator from "validator";

// Create a new user
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Username, email and password are required"
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Please provide a valid email"
      });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        status: false,
        message: "Username or email already exists"
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Password must be at least 6 characters"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'student' // Default to student if not provided
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(StatusCodes.CREATED).json({
      status: true,
      message: "User created successfully",
      data: userResponse
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to create user",
      error: error.message
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude passwords
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

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

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
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    // Find user first
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "User not found"
      });
    }

    // Prepare update fields
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) {
      if (!validator.isEmail(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: false,
          message: "Please provide a valid email"
        });
      }
      updateFields.email = email;
    }
    if (password) {
      if (password.length < 6) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: false,
          message: "Password must be at least 6 characters"
        });
      }
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }
    if (role) {
      if (!['student', 'teacher', 'admin'].includes(role)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: false,
          message: "Invalid role specified"
        });
      }
      updateFields.role = role;
    }

    // Perform update
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(StatusCodes.OK).json({
      status: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to update user",
      error: error.message
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "User not found"
      });
    }

    res.status(StatusCodes.OK).json({
      status: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to delete user",
      error: error.message
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};