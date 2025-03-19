import { Router } from "express";
import {authController} from "../controllers/auth.controller.js";
import validateCredentials from "../middlewares/validateCredentials.middleware.js"
const router = Router();

router.post("/register-otp-request", authController.requestRegisterOTP);
router.post("/register",validateCredentials("register"), authController.registerUser);
router.post("/login",validateCredentials("login"),authController.loginUser );
router.post("/forgot-password",authController.forgotPassword );
router.post("/reset-password",authController.resetPassword );
router.post("/logout",authController.logout );

export default router;