import TeamTask from "../models/teamTask.model.js";
import { StatusCodes } from "http-status-codes";

const createTeamTask = async (req, res) => {
  try {
    const { teamId, assignedTask, remarks } = req.body;

    if (!teamId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Team ID is required",
      });
    }

    const teamTask = await TeamTask.create({ teamId, assignedTask, remarks });
    
    res.status(StatusCodes.CREATED).json({ 
      status: true, 
      message: "Team task/remark created successfully", 
      data: teamTask 
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getTeamTasks = async (req, res) => {
  try {
    const { teamId } = req.params;
    const tasks = await TeamTask.find({ teamId }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Team tasks/remarks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateTeamTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTask, remarks } = req.body;

    const updatedTask = await TeamTask.findByIdAndUpdate(
      id,
      { assignedTask, remarks },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Team task/remark not found",
      });
    }

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Team task/remark updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const deleteTeamTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await TeamTask.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Team task/remark not found",
      });
    }

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Team task/remark deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await TeamTask.find().sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      status: true,
      message: "All tasks/remarks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const teacherController = {
  createTeamTask,
  getTeamTasks,
  updateTeamTask,
  deleteTeamTask,
  getAllTasks,
};