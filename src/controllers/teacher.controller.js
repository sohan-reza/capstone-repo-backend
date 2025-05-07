import TeamTask from "../models/teamTask.model.js";
import Notice from "../models/notice.model.js";
import { StatusCodes } from "http-status-codes";

const createTeamTask = async (req, res) => {
  try {
    const { teamName, assignedTask, remarks } = req.body;

    if (!teamName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Team Name is required",
      });
    }

    const teamTask = await TeamTask.create({ teamName, assignedTask, remarks });
    
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
    const { teamName } = req.params;
    const tasks = await TeamTask.find({ teamName });

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
    const { assignedTask, remarks, status } = req.body;

    const updateFields = {};
    if (assignedTask !== undefined) updateFields.assignedTask = assignedTask;
    if (remarks !== undefined) updateFields.remarks = remarks;
    if (status !== undefined) updateFields.status = status;

    const updatedTask = await TeamTask.findByIdAndUpdate(
      id,
      updateFields,
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

const createNotice = async (req, res) => {
  try {
    const { teamName, noticeTitle, noticeDetails } = req.body;

    // Validate required fields
    if (!teamName || !noticeTitle || !noticeDetails) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "All fields (teamName, noticeTitle, noticeDetails) are required",
      });
    }

    const newNotice = await Notice.create({
      teamName,
      noticeTitle,
      noticeDetails,
    });

    res.status(StatusCodes.CREATED).json({
      status: true,
      message: "Notice created successfully",
      data: newNotice,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to create notice",
      error: error.message,
    });
  }
};

const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    
    res.status(StatusCodes.OK).json({
      status: true,
      message: "Notices retrieved successfully",
      data: notices,
      count: notices.length,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to retrieve notices",
      error: error.message,
    });
  }
};

const getNoticesByTeam = async (req, res) => {
  try {
    const { teamName } = req.params;
    const notices = await Notice.find({ teamName }).sort({ createdAt: -1 });

    if (notices.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: `No notices found for team ${teamName}`,
      });
    }

    res.status(StatusCodes.OK).json({
      status: true,
      message: `Notices for team ${teamName} retrieved successfully`,
      data: notices,
      count: notices.length,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to retrieve team notices",
      error: error.message,
    });
  }
};

const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { noticeTitle, noticeDetails } = req.body;

    if (!noticeTitle && !noticeDetails) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "At least one field (noticeTitle or noticeDetails) must be provided",
      });
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      { noticeTitle, noticeDetails },
      { new: true, runValidators: true }
    );

    if (!updatedNotice) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Notice not found",
      });
    }

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Notice updated successfully",
      data: updatedNotice,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to update notice",
      error: error.message,
    });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotice = await Notice.findByIdAndDelete(id);

    if (!deletedNotice) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Notice not found",
      });
    }

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Notice deleted successfully",
      data: deletedNotice,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to delete notice",
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
  createNotice,
  getAllNotices,
  getNoticesByTeam,
  updateNotice,
  deleteNotice,
};