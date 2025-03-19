import {Schema,model} from "mongoose";

const OtpSchema = new Schema({
  email: {
    type: String,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});
const Otp=model("Otp", OtpSchema);
export default Otp;
