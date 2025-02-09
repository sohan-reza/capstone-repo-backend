import { Router } from "express";
import {userController} from "../controllers/auth.controller.js";
import authReqValidation from "../middlewares/authReqValidation.js"
const router = Router();

router.post("/register",authReqValidation, userController.registerUser);
router.post("/login",authReqValidation,userController.loginUser );

export default router;