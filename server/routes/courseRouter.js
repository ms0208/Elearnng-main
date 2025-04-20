import express from 'express';
import { createCourse, getCourses, getCourseById } from '../controllers/courseController.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure upload directory exists
const uploadPath = 'uploads/images';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Image Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// File filter to accept only images (optional but safe)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// ✅ ROUTES
router.post('/create', upload.single('image'), createCourse);
router.get('/course', getCourses);
router.get('/course/:id', getCourseById);

export default router;

