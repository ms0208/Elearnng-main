// routes/recommendationRoutes.mjs
import express from 'express';
import {
  getRecommendations,
  getCourses,
  getBatchRecommendations
} from '../controllers/recommendationController.js';

const router = express.Router();

router.post('/recommend', getRecommendations);
router.get('/courses', getCourses);
router.post('/batch-recommend', getBatchRecommendations);

export default router;
