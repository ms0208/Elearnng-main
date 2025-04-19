import express from 'express';
import { createCourse, getCourses , getCourseById } from '../controllers/courseController.js';

const router = express.Router();

router.post('/create', createCourse);
router.get('/course', getCourses);
router.get('/course/:id',getCourseById)
export default router;
