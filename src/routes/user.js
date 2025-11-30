import express from 'express';
import { protect } from '../middlewares/auth.js';
import { getMyProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getMyProfile);

export default router;