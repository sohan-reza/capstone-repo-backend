import { Router } from "express";
import authRoute from "./auth.route.js";
import studentRoute from "./student.route.js";
import teacherRoute from "./teacher.route.js";

const router=Router();
router.use('/auth', authRoute);
router.use('/student', studentRoute); 
router.use('/teacher', teacherRoute); 

export default router;