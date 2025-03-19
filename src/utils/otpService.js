import crypto from "crypto";
import Otp from "../models/otp.model.js";

export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export async function storeOTP(email, otp) {
  await Otp.create({ email, otp });
}

export async function verifyOTP(email, enteredOTP) {
  const otpRecord = await Otp.findOne({ email,otp:enteredOTP });
  if (!otpRecord) return false;

  const isMatch = otpRecord.otp === enteredOTP;

  if (isMatch) await Otp.deleteMany({ email});
  return isMatch;
}

