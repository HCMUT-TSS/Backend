import express from 'express';
import { protect, requireRole } from '../middlewares/auth.js';
import {
  getMySchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getPendingRequests,
  confirmRequests,
  rejectRequests,
  addResourceToSession,
  getSessionDetail,
} from '../controllers/tutorController.js';

const router = express.Router();

// === Áp dụng middleware bảo vệ và phân quyền tutor cho toàn bộ route ===
router.use(protect);
router.use(requireRole('tutor'));

// 1. Quản lý lịch rảnh (schedule)
router.get('/schedule', getMySchedule);                    // Xem lịch của mình
router.post('/schedule', createSchedule);                  // Tạo lịch mới
router.patch('/schedule/:id', updateSchedule);             // CẬP NHẬT lịch (mới thêm)
router.delete('/schedule/:id', deleteSchedule);            // Xóa lịch

// 2. Quản lý yêu cầu đặt lịch (booking requests)
router.get('/booking-requests', getPendingRequests);       // Xem tất cả request (pending + confirmed)
router.patch('/booking-requests/:id/confirm', confirmRequests); // Xác nhận
router.patch('/booking-requests/:id/reject', rejectRequests);   // Từ chối

// 3. Quản lý buổi học (session) - chi tiết & tài liệu
router.get('/sessions/:id', getSessionDetail);             // Xem chi tiết 1 buổi học
router.post('/sessions/:id/resources', addResourceToSession); // Thêm tài liệu vào buổi học

export default router;