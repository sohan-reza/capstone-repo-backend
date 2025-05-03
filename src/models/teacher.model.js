import { Schema, model } from "mongoose";

const userSchema = new Schema({
  shortName: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  educationalMail: { type: String, required: true, unique: true },
  defaultPassword: { type: String, required: true },
  userId: {type: String}
}, { timestamps: true });

const Teacher = model("Teacher", userSchema);

export default Teacher;
