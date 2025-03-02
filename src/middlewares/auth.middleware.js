import { StatusCodes } from "http-status-codes";
import { blacklist } from "../utils/blacklistStore";

const verifyJWT=async(req,res,next)=>{
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({ status:false,message: "Token is required" });
    }

    if (blacklist.has(token)) {
      return res.status(StatusCodes.FORBIDDEN).json({ status:false,message: 'Token has been invalidated' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user=decoded;
      next();
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({ status: false, message: "Invalid or expired token" });
    }
}

export default verifyJWT;