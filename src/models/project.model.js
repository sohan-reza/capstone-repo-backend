import { Schema, model } from "mongoose";

const projectSchema = new Schema({
  projectTitle: { type: String, required: true },
  abstract: { type: String, required: true },
  teamName: { type: String, required: true },
  projectType: { 
    type: String, 
    required: true,
    enum: ['Software', 'AI'] 
  },
  keywords: { type: [String], required: true },
  technologies: { type: [String], required: true },
  furtherImprovement: { type: String },
  department: { type: String },
  completionDate: { type: Date, required: true },
  authors: { type: [String] },
  supervisor: { type: String },
  projectCategory: { 
    type: String, 
    required: true,
    enum: ['Thesis', 'Research Project', 'Course Project', 'Personal Project'] 
  },
  createdAt: { type: Date, default: Date.now }
});

const Project = model('Project', projectSchema);

export default Project;