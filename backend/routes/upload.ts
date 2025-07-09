import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,'../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Extend Request type to include 'file'
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  const multerReq = req as MulterRequest;
  if (!multerReq.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  res.status(200).json({ message: 'Upload successful', filename: multerReq.file.filename });
});

export default router;
