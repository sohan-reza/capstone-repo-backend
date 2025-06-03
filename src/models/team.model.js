import { Schema, model } from "mongoose";
import validator from 'validator';

const emailRegex = /^[a-zA-Z0-9._]+@(bubt\.edu\.bd|cse\.bubt\.edu\.bd)$/;

const memberSchema = new Schema({
  username: { type: String, required: true }, 
  intake: { type: String, required: true },   
  section: { type: String, required: true },  
  department: { type: String, required: true }, 
  educationalMail: { type: String, match: [emailRegex, 'Invalid email format. Only BUBT email addresses are allowed'], required: true, unique: true },
  phone: { type: String, required: true,unique:true,validate: {
      validator: function (value) {
        return validator.isMobilePhone(value, 'bn-BD');
      },
      message: 'Invalid phone number',
    },
   } 
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
