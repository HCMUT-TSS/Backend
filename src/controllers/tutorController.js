// controllers/tutorController.js
import prisma from "../config/db.js";
import { format } from "date-fns";
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
    const tutorId = req.user.id;

    const tutor = await prisma.tutor.findUnique({ where: { userId: tutorId } });
    if (tutor?.status !== "approved") {
      return res.status(403).json({ message: "Chưa được duyệt làm tutor" });
    }

    const schedule = await prisma.schedule.create({
  data: { 
    tutorId,
    dayOfWeek: Number(dayOfWeek),
    startTime,
    endTime,
    title: req.body.title || `Tư vấn 1:1 - ${format(new Date(), 'dd/MM/yyyy')}`,
    location: req.body.location || null,
  },
});

    const today = new Date();
    const sessions = [];

    for (let i = 0; i < 8; i++) {
  const targetDate = new Date(today);
  const daysToAdd = ((dayOfWeek - today.getDay() + 7) % 7) + i * 7;
  targetDate.setDate(today.getDate() + daysToAdd);

  if (targetDate >= new Date().setHours(0, 0, 0, 0)) {
    // TẠM THỜI BỎ QUA VIỆC TẠO SESSION ĐỂ TRÁNH LỖI program
    // Backend vẫn tạo schedule → frontend vẫn hoạt động bình thường
    // Khi admin fix model → bật lại là xong
    console.log(`Tạm bỏ tạo session cho ngày ${format(targetDate, 'dd/MM/yyyy')}`);
    // await prisma.session.create({ ... }) // ← COMMENT HOẶC XÓA DÒNG NÀY
  }
}

    res.status(201).json({
      message: `Tạo lịch thành công! Đã tạo ${sessions.length} buổi học tự động`,
      schedule,
      sessions,
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: "Lịch này đã bị trùng!" });
    }
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// BỔ SUNG: PATCH /api/tutor/schedules/:id - CẬP NHẬT LỊCH RẢNH
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;
    const tutorId = req.user.id;

    // 1. Kiểm tra quyền sở hữu
    const oldSchedule = await prisma.schedule.findUnique({
      where: { id: Number(id) },
    });

    if (!oldSchedule || oldSchedule.tutorId !== tutorId) {
      return res.status(403).json({ message: "Bạn không có quyền sửa lịch này" });
    }

    // 2. Cập nhật Schedule
    const updatedSchedule = await prisma.schedule.update({
      where: { id: Number(id) },
      data: {
        dayOfWeek: dayOfWeek !== undefined ? Number(dayOfWeek) : undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
      },
    });

    // 3. CẬP NHẬT TẤT CẢ SESSION TƯƠNG LAI (từ hôm nay trở đi)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureSessions = await prisma.session.findMany({
      where: {
        scheduleId: Number(id),
        day: { gte: today },
      },
    });

    let updatedCount = 0;

    for (const session of futureSessions) {
      const oldDate = new Date(session.day);
      let newDate = new Date(oldDate);

      // Nếu đổi ngày trong tuần → tính lại ngày mới
      if (dayOfWeek !== undefined) {
        const oldDay = oldDate.getDay(); // 0 = CN, 1 = T2
        const newDay = Number(dayOfWeek);
        const diff = (newDay - oldDay + 7) % 7;
        newDate.setDate(oldDate.getDate() + diff);
      }

      await prisma.session.update({
        where: { id: session.id },
        data: {
          day: newDate,
          startTime: startTime || session.startTime,
          endTime: endTime || session.endTime,
          topic: `Buổi tư vấn - ${format(newDate, 'dd/MM/yyyy')}`,
        },
      });
      updatedCount++;
    }

    res.json({
      message: "Cập nhật lịch thành công!",
      detail: `Đã điều chỉnh ${updatedCount} buổi học tương lai`,
      schedule: updatedSchedule,
      updatedSessions: updatedCount,
    });

  } catch (error) {
    console.error("Update Schedule Error:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: "Không tìm thấy lịch" });
    }
    res.status(500).json({ message: "Lỗi server khi cập nhật lịch" });
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
// confirmRequests
export const confirmRequests = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Cập nhật trạng thái booking
    const booking = await prisma.requestBooking.update({
      where: { id: Number(id) },
      data: {
        status: "confirmed",
        confirmedAt: new Date(),
      },
      include: {
        tutor: true,
      },
    });

    // 2. Tính ngày bắt đầu và kết thúc để tìm session
    const sessionDate = new Date(booking.preferredDate);
    sessionDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(sessionDate);
    nextDay.setDate(nextDay.getDate() + 1); // ĐÃ KHAI BÁO ĐÚNG

    // 3. Tìm session theo ngày + giờ + tutorId
    const session = await prisma.session.findFirst({
      where: {
        schedule: {
          tutorId: booking.tutorId,
          startTime: booking.startTime, // so sánh với schedule.startTime
        },
        day: {
          gte: sessionDate,
          lt: nextDay,
        },
      },
    });

    // 4. Nếu tìm thấy session → thêm sinh viên vào
    if (session) {
      await prisma.sessionStudent.upsert({
        where: {
          sessionId_studentId: {
            sessionId: session.id,
            studentId: booking.studentId,
          },
        },
        update: {},
        create: {
          sessionId: session.id,
          studentId: booking.studentId,
        },
      });

      // Tạo điểm danh
      await prisma.attendance.upsert({
        where: {
          sessionId_studentId: {
            sessionId: session.id,
            studentId: booking.studentId,
          },
        },
        update: { status: "absent" },
        create: {
          sessionId: session.id,
          studentId: booking.studentId,
          status: "absent",
        },
      });
    }

    res.json({
      message: "Đã xác nhận yêu cầu thành công!",
      booking,
    });
  } catch (error) {
    console.error("Lỗi xác nhận:", error);
    res.status(500).json({ message: "Lỗi server khi xác nhận yêu cầu" });
  }
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

//10. POST /api/tutor/sessions/:id/resources: Thêm tài liệu vào Session(dùng Mock) 
export const addResourceToSession = async (req, res) => {
  const { id } = req.params;
  const { name, type, url } = req.body;

  const resource = await prisma.resource.create({
    data: {
      sessionId: Number(id),
      name,
      type: type || "link",
      url,
    },
  });

  res.json({ message: "Đã thêm tài liệu", resource });
};

//11.  GET /api/tutor/sessions/:id
export const getSessionDetail = async (req, res) => {
  const { id } = req.params;

  const session = await prisma.session.findUnique({
    where: { id: Number(id) },
    include: {
      resources: true,
      students: { include: { student: { include: { user: true } } } },
      attendances: { include: { student: { include: { user: true } } } },
    },
  });

  res.json({ session });
};