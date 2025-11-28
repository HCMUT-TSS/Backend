import express from 'express';
import {
    getAvailableSlots,
    createBookingRequest,
    getMyBookings
} from "../controllers/studentController.js";
import { protect, requireRole } from '../middlewares/auth.js';

const router = express.Router();

//Middleware
router.use(protect);

router.get("/availabilities", getAvailableSlots);
router.post("/bookings/request", createBookingRequest);
router.get("/my/bookings", getMyBookings);

export default router;