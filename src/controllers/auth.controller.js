
import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { blacklist } from "../utils/blacklistStore.js";

const registerUser=async(req,res)=>{
  try {
    const {username,email,password,role}=req.body;
    const Email= await User.findOne({email:email});
    if(Email){
        res.status(StatusCodes.BAD_REQUEST)
        .json({
          status:false,
          message:"This email already exists",
          data:""
        })
        return;
    }
    const hashpassword=await bcrypt.hash(password,10);
    const user=new User({username,email,password:hashpassword,role});
    await user.save();
    
    res.status(StatusCodes.CREATED)
      .json({
        status:true,
        message:"Successfully register",
        data:user
     })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          status:false,
          message:"something went wrong"
        })
  }
}

const loginUser=async(req,res)=>{
  try {
    const {email,password,rememberMe}=req.body;
    
    const userByemail= await User.findOne({email:email});
    if(!userByemail){
      res.status(StatusCodes.UNAUTHORIZED)
        .json({
          status:false,
          message:"invalid credentials",
          
        })
        return;
    }
    const isMatchPassword=await bcrypt.compare(password,userByemail.password);
    if(!isMatchPassword){
      res.status(StatusCodes.UNAUTHORIZED)
        .json({
          status:false,
          message:"invalid credentials",
          
        })
      return;
    }
    const payload={
      id:userByemail._id,
      email:userByemail.email,
      role:userByemail.role
    }
    const expiresIn = rememberMe ? "7d" : "1h";
    const token=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn});
    
    res.status(StatusCodes.CREATED)
      .json({
        status:true,
        message:"Successfully login",
        accesstoken:token
     })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          status:false,
          message:"something went wrong"
        })
        console.log(error);
        
  }
}

const logout =async(req,res)=>{
  try {
    const token = req.header('Authorization')?.split(' ')[1];

    if (token) {
        blacklist.add(token);
    }

    res.json({ status:true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          status:false,
          message:"something went wrong"
        })
        console.log(error);
        
  }
}

export const authController={
  registerUser,
  loginUser,
  logout
}