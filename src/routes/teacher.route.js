import { Router } from "express";
import {teacherController} from "../controllers/teacher.controller.js"
const router = Router();

router.post("/team/task", teacherController.createTeamTask);
router.get("/team/task/:teamId", teacherController.getTeamTasks);
router.get("/team/task", teacherController.getAllTasks);
router.put("/team/task/:id", teacherController.updateTeamTask);
router.delete("/team/task/:id", teacherController.deleteTeamTask);



export default router;