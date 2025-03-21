import { Router } from "express";
import {studentController} from "../controllers/student.controller.js";
import validateCredentials from "../middlewares/validateCredentials.middleware.js"
const router = Router();

router.post("/groups", studentController.createGroup);
router.get("/groups", studentController.getGroups);
router.get("/groups/:id", studentController.getGroupById);
router.patch("/groups/:id", studentController.updateGroup);
router.delete("/groups/:id", studentController.deleteGroup);

export default router;