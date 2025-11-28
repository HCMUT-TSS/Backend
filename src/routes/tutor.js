import express from 'express';
import { protect, requireRole } from '../middlewares/auth.js';
import {
    rejectRequests,
    getMySchedule,
    createSchedule,
    getPendingRequests,
    confirmRequests,
    deleteSchedule,
} from '../controllers/tutorController.js'

const router = express.Router();

//Middleware
router.use(protect);
router.use(requireRole("tutor"));

router.get('/schedule', getMySchedule);
router.post('/schedule', createSchedule);
router.patch('/booking-requests/:id/reject', rejectRequests);
router.patch('/booking-requests/:id/confirm', confirmRequests);
router.get('/booking-requests', getPendingRequests);
router.delete('/schedule/:id', deleteSchedule);

export default router;