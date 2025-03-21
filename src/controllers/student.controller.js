import Group from "../models/group.model.js";
import { StatusCodes } from "http-status-codes";

export const createGroup = async (req, res) => {
  try {
    const { groupName, intake, section, department, educationalMail, phone } = req.body;
    
    const existingGroup = await Group.findOne({ educationalMail });
    if (existingGroup) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "A group with this email already exists",
      });
    }

    const group = await Group.create({ groupName, intake, section, department, educationalMail, phone });
    res.status(StatusCodes.CREATED).json({ status: true, message: "Group created successfully", data: group });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(StatusCodes.OK).json({ status: true, data: groups });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Group not found" });
    }
    res.status(StatusCodes.OK).json({ status: true, data: group });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const updatedGroup = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedGroup) {
      return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Group not found" });
    }
    res.status(StatusCodes.OK).json({ status: true, message: "Group updated successfully", data: updatedGroup });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.id);
    if (!deletedGroup) {
      return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Group not found" });
    }
    res.status(StatusCodes.OK).json({ status: true, message: "Group deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
  }
};



export const studentController={
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup
}