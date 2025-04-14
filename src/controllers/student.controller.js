import Group from "../models/group.model.js";
import { StatusCodes } from "http-status-codes";

const createGroup = async (req, res) => {
  try {
    const { teamName, members } = req.body;

    if (!teamName || typeof teamName !== 'string' || teamName.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: 'Team name is required and must be a non-empty string.',
      });
    }

    if (!Array.isArray(members)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: 'Members must be an array.',
      });
    }

    if (members.length !== 5) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: 'A team must have exactly 5 members.',
      });
    }

    const emails = members.map((m) => m.educationalMail);
    const emailSet = new Set(emails);
    if (emailSet.size !== emails.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: 'Each member must have a unique educationalMail within the team.',
      });
    }

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const requiredFields = ['username', 'intake', 'section', 'department', 'educationalMail', 'phone'];
      const missingFields = requiredFields.filter((field) => !member[field] || typeof member[field] !== 'string' || member[field].trim() === '');

      if (missingFields.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: false,
          message: `Member ${i + 1} is missing or has invalid fields: ${missingFields.join(', ')}`,
        });
      }
    }

    const existingGroup = await Group.findOne({ teamName });
    if (existingGroup) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: 'A group with this name already exists.',
      });
    }

    const conflictingMembers = await Group.find({
      'members.educationalMail': { $in: emails },
    });

    if (conflictingMembers.length > 0) {
      const usedEmails = [];
      conflictingMembers.forEach((group) => {
        group.members.forEach((member) => {
          if (emails.includes(member.educationalMail)) {
            usedEmails.push(member.educationalMail);
          }
        });
      });

      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: `The following member(s) are already part of another group: ${[...new Set(usedEmails)].join(', ')}`,
      });
    }

    const group = await Group.create({ teamName, members });

    return res.status(StatusCodes.CREATED).json({
      status: true,
      message: 'Group created successfully.',
      data: group,
    });
  } catch (error) {
    console.error('Error creating group:', error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Something went wrong while creating the group.',
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

const updateGroupMember = async (req, res) => {
  try {
    const { teamName, educationalMail } = req.params;
    const updatedData = req.body;
    if (!teamName || !educationalMail || !updatedData) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: 'Missing teamName, educationalMail, or updatedData.',
      });
    }

    if (updatedData.educationalMail && updatedData.educationalMail !== educationalMail) {
      const exists = await Group.findOne({
        'members.educationalMail': updatedData.educationalMail,
      });

      if (exists) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: false,
          message: `Educational mail "${updatedData.educationalMail}" already exists.`,
        });
      }
    }
    const updateFields = {};
    for (const key in updatedData) {
      updateFields[`members.$.${key}`] = updatedData[key];
    }

    const result = await Group.updateOne(
      { teamName, 'members.educationalMail': educationalMail },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: 'Member or group not found.',
      });
    }

    return res.status(StatusCodes.OK).json({
      status: true,
      message: 'Member updated successfully.',
    });
  } catch (error) {
    console.error('Error updating member:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: 'Something went wrong.',
      error: error.message,
    });
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
    updateGroupMember,
    deleteGroup
}