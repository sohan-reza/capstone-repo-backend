import { Router } from "express";
import authRoute from "./auth.route.js";
import studentRoute from "./student.route.js";

const router=Router();
router.use('/auth', authRoute);
router.use('/student', studentRoute); 

export default router;