import { Schema, model } from "mongoose";

const memberSchema = new Schema({
  username: { type: String, required: true }, 
  intake: { type: String, required: true },   
  section: { type: String, required: true },  
  department: { type: String, required: true }, 
  educationalMail: { type: String, required: true, unique: true },
  phone: { type: String, required: true } 
});

const teamSchema = new Schema({
  teamName: { type: String, required: true,unique: true},
  assignedTeacher: { type: String},
  teacherId: {type: String},
  members: {
    type: [memberSchema],
    validate: {
      validator: function(v) {
        return v.length <= 5; 
      },
     message: 'A team can have at most 5 members'
    },
    required: true
  }
});

const Team = model('Team', teamSchema);

export default Team;
