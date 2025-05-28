import Project from "../models/project.model.js";
import { StatusCodes } from "http-status-codes";
import Team from "../models/team.model.js";

const createProject = async (req, res) => {
  try {
    const {
      projectTitle,
      abstract,
      teamName,
      supervisor,
      projectType,
      keywords,
      technologies,
      furtherImprovement,
      department,
      completionDate,
      authors,
      projectCategory
    } = req.body;

    // Validate required fields
    const requiredFields = {
      projectTitle,
      abstract,
      teamName,
      projectType,
      keywords,
      technologies,
      completionDate,
      projectCategory
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate word count for abstract
    const wordCount = abstract.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 150 || wordCount > 250) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Abstract must be between 150-250 words " + wordCount
      });
    }

    // Validate arrays
    if (!Array.isArray(keywords) || !Array.isArray(technologies)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Keywords and technologies must be arrays"
      });
    }

    // Create the project
    const project = await Project.create({
      projectTitle,
      abstract,
      teamName,
      projectType,
      keywords,
      technologies,
      furtherImprovement,
      department,
      completionDate: new Date(completionDate),
      authors,
      supervisor,
      projectCategory
    });

    res.status(StatusCodes.CREATED).json({
      status: true,
      message: "Project created successfully",
      data: project
    });

  } catch (error) {
    console.error("Error creating project:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to create project",
      error: error.message
    });
  }
};

const getProjectsByTeam = async (req, res) => {
  try {
    const { teamName } = req.params;
    
    const projects = await Project.find({ teamName }).sort({ createdAt: -1 });
   
    res.status(StatusCodes.OK).json({
      status: true,
      message: "Projects retrieved successfully",
      data: projects
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to retrieve projects",
      error: error.message
    });
  }
};
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Project not found"
      });
    }

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Project retrieved successfully",
      data: project
    });
  } catch (error) {
    console.error("Error retrieving project:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to retrieve project",
      error: error.message
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    res.status(StatusCodes.OK).json({
      status: true,
      message: "All projects retrieved successfully",
      data: projects
    });
  } catch (error) {
    console.error("Error retrieving all projects:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to retrieve projects",
      error: error.message
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      projectTitle,
      abstract,
      projectType,
      keywords,
      technologies,
      furtherImprovement,
      department,
      completionDate,
      authors,
      projectCategory
    } = req.body;

    // console.log("Error: " + req.body.teamName);

    const project = await Project.findById(id);
    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Project not found"
      });
    }

    // Validate required fields if they're provided
    if (abstract) {
      const wordCount = abstract.split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount < 150 || wordCount > 250) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: false,
          message: "Abstract must be between 150-250 words"
        });
      }
    }

    // Prepare update object with only provided fields
    const updateData = {};
    if (projectTitle) updateData.projectTitle = projectTitle;
    if (abstract) updateData.abstract = abstract;
    if (projectType) updateData.projectType = projectType;
    if (keywords) updateData.keywords = keywords;
    if (technologies) updateData.technologies = technologies;
    if (furtherImprovement) updateData.furtherImprovement = furtherImprovement;
    if (department) updateData.department = department;
    if (completionDate) updateData.completionDate = new Date(completionDate);
    if (authors) updateData.authors = authors;
    if (projectCategory) updateData.projectCategory = projectCategory;

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Project updated successfully",
      data: updatedProject
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to update project",
      error: error.message
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: false,
        message: "Project not found"
      });
    }

    await Project.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({
      status: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: "Failed to delete project",
      error: error.message
    });
  }
};


export const projectController = {
  createProject,
  getProjectsByTeam,
  getProjectById,
  getAllProjects,
  updateProject,
  deleteProject
};