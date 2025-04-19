import { Schema, model } from "mongoose";

const teamTaskSchema = new Schema({
  teamId: {
    type: String,
    required: true,
    index: true 
  },
  assignedTask: {
    type: String,
    required: false
  },
  remarks: {
    type: String,
    required: false 
  },
  status: {
    type: String,
    required: false 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
teamTaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.status = "Not Completed"
  next();
});

const TeamTask = model('TeamTask', teamTaskSchema);

export default TeamTask;