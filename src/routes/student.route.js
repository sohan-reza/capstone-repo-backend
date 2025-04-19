import { Router } from "express";
import {studentController} from "../controllers/student.controller.js";
const router = Router();

router.post("/groups", studentController.createGroup);
router.get("/groups", studentController.getGroups);
router.get("/groups/:id", studentController.getGroupById);
router.get("/groups/myteam/:educationalmail", studentController.getGroupsByEducationalMail);
router.patch("/groups/name:id", studentController.updateGroupName);
router.put("/groups/:teamName/:educationalMail", studentController.updateGroupMember);
router.delete("/groups/:id", studentController.deleteGroup);

export default router;