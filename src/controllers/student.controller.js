import Group from "../models/group.model.js";
import { StatusCodes } from "http-status-codes";

const createGroup = async (req, res) => {
  try {
    const { teamName, members } = req.body;

    if (members.length !== 5) {
      return res.status(400).json({ message: 'A team must have exactly 5 members.' });
    }
    
    const existingGroup = await Group.findOne({ teamName });
    if (existingGroup) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "A group with this Name already exists",
      });
    }

    const group = await Group.create({ teamName, members });
    res.status(StatusCodes.CREATED).json({ status: true, message: "Group created successfully", data: group });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

 const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(StatusCodes.OK).json({ status: true, data: groups });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
  }
};

const getGroupById = async (req, res) => {
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

 const getGroupsByEducationalMail = async (req, res) => {
  try {
    const { educationalmail } = req.params;
    console.log(educationalmail);
    

    const groups = await Group.find({
      members: {
        $elemMatch: { educationalMail: educationalmail }
      }
    });

    if (groups.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "No groups found for this email",
      });
    }

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Groups retrieved successfully",
      data: groups,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

 const updateGroupName = async (req, res) => {
  try {
    const { teamName } = req.body;
    const updatedGroup = await Group.findByIdAndUpdate(req.params.id, { teamName }, { new: true, runValidators: true });
    if (!updatedGroup) {
      return res.status(StatusCodes.NOT_FOUND).json({ status: false, message: "Group not found" });
    }
    res.status(StatusCodes.OK).json({ status: true, message: "Group updated successfully", data: updatedGroup });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message });
  }
};

const deleteGroup = async (req, res) => {
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
    getGroupsByEducationalMail,
    updateGroupName,
    deleteGroup
}