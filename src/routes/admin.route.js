import express from "express";
import { adminController } from "../controllers/admin.controller.js";
import { userController } from '../controllers/user.controller.js';

const router = express.Router();

// router.post('user/', userController.createUser);
// router.get('user/', userController.getAllUsers);
// router.get('user/:id', userController.getUserById);
// router.patch('user/:id', userController.updateUser);
// router.delete('user/:id', userController.deleteUser);



router.post("/teachers", adminController.createUser);
router.get("/teachers", adminController.getAllUsers);
router.get("/teachers/:id", adminController.getUserById);
router.patch("/teachers/:id", adminController.updateUser);
router.delete("/teachers/:id", adminController.deleteUser);

export default router;
