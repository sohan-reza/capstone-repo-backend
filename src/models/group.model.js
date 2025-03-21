import { Schema, model } from "mongoose";

const groupSchema = new Schema({
  groupName: { type: String, required: true }, 
  intake: { type: String, required: true },   
  section: { type: String, required: true },  
  department: { type: String, required: true }, 
  educationalMail: { type: String, required: true, unique: true },
  phone: { type: String, required: true } 
});

const Group = model('Group', groupSchema);

export default Group;