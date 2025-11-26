// routes/admin.js
import express from 'express';
import {
  getPendingTutors,
  approveTutor,
  rejectTutor
} from '../controllers/adminController.js';
import { protect, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// Bảo vệ tất cả route admin
router.use(protect);
router.use(requireRole('admin'));

router.get('/pending-tutors', getPendingTutors);
router.patch('/approve/:userId', approveTutor);
router.patch('/reject/:userId', rejectTutor); 

export default router;