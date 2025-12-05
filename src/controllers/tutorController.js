// controllers/tutorController.js
import prisma from "../config/db.js";

// 1. GET: Xem lịch
export const getMySchedule = async (req, res) => {
    try {
        const tutorId = req.user.id;
        const schedules = await prisma.schedule.findMany({
            where: { tutorId, isActive: true },
            orderBy: { dayOfWeek: "asc" },
        });
        res.json({ schedules });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy lịch" });
    }
};

// 2. POST: Tạo lịch (Backend nhận dữ liệu và lưu vào DB)
export const createSchedule = async (req, res) => {
    try {
        const { dayOfWeek, startTime, endTime } = req.body;
        const userId = req.user.id;

        // 1. Kiểm tra quyền
        const tutor = await prisma.tutor.findUnique({ where: { userId: userId } });
        if (tutor?.status !== "approved") {
            return res.status(403).json({ message: "Tài khoản chưa được duyệt" });
        }

        // 2. Tạo lịch
        const schedule = await prisma.schedule.create({
            data: { 
                tutorId: userId, 
                dayOfWeek: Number(dayOfWeek), 
                startTime, 
                endTime 
            },
        });
        
        res.status(201).json({ message: "Thêm lịch thành công", schedule });

    } catch (error) {
        console.error("🔥 Server Error:", error);

        // --- BẮT LỖI TRÙNG LỊCH ĐỂ GỬI VỀ UI ---
        if (error.code === 'P2002') {
            // Trả về mã 409 (Conflict)
            return res.status(409).json({ 
                message: "Lịch này đã bị trùng! Bạn đã tạo khung giờ này rồi." 
            });
        }

        return res.status(500).json({ 
            message: "Lỗi hệ thống", 
            error: error.message 
        });
    }
};

// 3. DELETE: Xóa lịch
export const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const tutorId = req.user.id;

        // Xóa đúng lịch của tutor đó
        const result = await prisma.schedule.deleteMany({
            where: { 
                id: Number(id), 
                tutorId // Bảo mật: Chỉ xóa lịch của chính mình
            },
        });

        if (result.count === 0) {
            return res.status(404).json({ message: "Không tìm thấy lịch hoặc bạn không có quyền xóa" });
        }

        res.json({ message: "Xóa lịch thành công" });
    } catch (error) {
        console.error("Delete Schedule Error:", error);
        res.status(500).json({ message: "Lỗi server khi xóa lịch" });
    }
};

//6.	GET /api/tutor/booking-requests: xem danh sách đang chờ(tutor)
export const getPendingRequests = async (req, res) => {
    const tutorId = req.user.id;
    // XÓA filter status: "pending" để lấy cả confirmed hiển thị lên lịch
    const requests = await prisma.requestBooking.findMany({
        where: { tutorId }, 
        include: {
            student: { 
                include: { 
                    user: { 
                        select: { name: true, ssoSub: true, faculty: true, email: true } // Thêm email nếu schema có
                    } 
                } 
            },
        },
        orderBy: { preferredDate: "desc" }, // Sắp xếp theo ngày dự kiến học
    });
    res.json({ requests });
};

//7.	PATCH /api/tutor/booking-requests/:id/confirm: xác nhận tư vấn
export const confirmRequests = async (req,res) =>{
    const { id } = req.params;
  const booking = await prisma.requestBooking.update({
    where: { id: Number(id) },
    data: {
      status: "confirmed",
      confirmedAt: new Date(),
    },
    include: {
      student: { include: { user: { select: { name: true } } } },
    },
  });
  res.json({ message: "Đã xác nhận buổi tư vấn", booking });
};

//8.	PATCH /api/tutor/booking-requests/:id/reject: từ chối tư vấn 
export const rejectRequests = async (req, res) => {
  const { id } = req.params;

  const booking = await prisma.requestBooking.update({
    where: { id: Number(id) },
    data: {
      status: "rejected",
      cancelledAt: new Date(),
    },
  });
  res.json({ message: "Đã từ chối yêu cầu", booking });
};