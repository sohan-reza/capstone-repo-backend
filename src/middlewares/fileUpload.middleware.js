import multer from "multer";
import fs from 'fs';
import path from 'path';

const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage=multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename:(req,file,cb)=>{
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
})

export const upload=multer({
  storage:storage,
  limits:{fileSize:10*1024*1024},
  fileFilter:(req,file,cb)=>{
    const filetypes=/docx|pdf|zip/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Support only! (docx,pdf,zip)'));
    }
  }
})

