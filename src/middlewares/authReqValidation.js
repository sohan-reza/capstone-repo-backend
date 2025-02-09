import { StatusCodes } from "http-status-codes";

const authReqValidation = (req, res, next)=> {
  
    const { email,password } = req.body;
    
    if (!email) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is required" });
      return;
    }
    if (!password) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "password is required" });
      return;
    }
    const emailRegex = /^(?:[a-zA-Z]+@bubt\.edu\.bd|\d+@cse\.bubt\.edu\.bd)$/;
    if (!emailRegex.test(email)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid email format only allowed bubt edu mail" });
      return;
    }
    next();
};

export default authReqValidation;