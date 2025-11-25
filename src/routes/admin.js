import express from 'express';
import { requireRole, protect } from '../middlewares/auth.js';
import { getPendingTutors, approveTutor, rejectTutor } from '../controllers/adminController.js';

const router = express.Router();

//Only for admin
router.use(protect);
router.use(requireRole("admin"));

router.get("/tutors/pending", getPendingTutors);
router.patch("/tutors/:tutorId/approve", approveTutor);
router.patch("/tutors/:tutorId/reject", rejectTutor);

export default router;