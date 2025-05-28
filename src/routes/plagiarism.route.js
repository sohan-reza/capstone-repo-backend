import express from "express";
import { checkPlagiarismController } from "../controllers/checkPlagiarismController.js";
import { upload } from "../middlewares/fileUpload.middleware.js";

const router = express.Router();


router.post("/",upload.single('file'),checkPlagiarismController);


export default router;