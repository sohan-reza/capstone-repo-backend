import { StatusCodes } from "http-status-codes";

const ValidateCredentials = (type)=>{
   return (req, res, next)=> {
  
    const { username,email,OtpCode,password } = req.body;

    if (type === "register" && !username) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username is required for registration" });
    }

    if(type === "register" && !OtpCode){
      return res.status(StatusCodes.BAD_REQUEST)
      .json({
        status:false,
        message:"Otp not found",
        data:""
      })
  }
    
    if (!email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Email and password are required" });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._]+@(bubt\.edu\.bd|cse\.bubt\.edu\.bd)$/;
    if (!emailRegex.test(email)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email format only allowed bubt edu mail" });
      return;
    }
    next();
  };
}

export default ValidateCredentials;