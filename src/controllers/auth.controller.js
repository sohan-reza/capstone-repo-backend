
import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser=async(req,res)=>{
  try {
    const {email,password,role}=req.body;
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
    const user=new User({email,password:hashpassword,role});
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
    const {email,password}=req.body;
    
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
    const token=jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'1d'});
    
    res.status(StatusCodes.CREATED)
      .json({
        status:true,
        message:"Successfully login",
        acesstoken:token
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

export const userController={
  registerUser,
  loginUser
}