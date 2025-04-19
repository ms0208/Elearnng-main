import express from 'express';
import { createInteraction, getInteractions } from '../controllers/intractioncontroller.js';

const router = express.Router();

router.post('/', createInteraction);
router.get('/', getInteractions);

export default router;
