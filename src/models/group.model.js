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

const Group = model('Group', teamSchema);

export default Group;
