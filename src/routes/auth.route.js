import { Router } from "express";
import {authController} from "../controllers/auth.controller.js";
import authReqValidation from "../middlewares/authReqValidation.js"
const router = Router();

router.post("/register",authReqValidation, authController.registerUser);
router.post("/login",authReqValidation,authController.loginUser );
router.post("/jwt/verify",authController.verify );
router.post("/logout",authController.logout );

export default router;