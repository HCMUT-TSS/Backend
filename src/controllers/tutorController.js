import prisma from "../config/db.js";

// 1.	GET /api/tutor/schedule: tutor xem lịch cá nhân
export const getMySchedule = async (req, res) => {
    const tutorId = req.user.id;
    const schedules = await prisma.schedule.findMany({
        where: { tutorId, isActive: true },
        orderBy: { dayOfWeek: "asc" },
    });
    res.json({ schedules })
};

//2.	POST /api/tutor/schedule: tutor tạo lịch 
export const createSchedule = async (req, res) => {
    const { dayOfWeek, startTime, endTime } = req.body;
    const tutorId = req.user.id;
    const tutor = await prisma.tutor.findUnique({ where: { userId: tutorId } });
    if (tutor?.status !== "approved")
        return res.status(403).json({ message: "Chưa được duyệt làm tutor" });
    try {
        const schedule = await prisma.schedule.create({
            data: { tutorId, dayOfWeek: Number(dayOfWeek), startTime, endTime },
        });
        res.status(201).json({ message: "Thêm lịch thành công", schedule });
    }
    catch (error) {
        res.status(400).json({ message: "Lịch trùng hoặc sai định dạng" });
    }
};

//3.	DELETE /api/tutor/schedule/:id: tutor xóa	lịch
export const deleteSchedule = async (req, res) => {
    const { id } = req.params;
    const tutorId = req.user.id;

    await prisma.schedule.deleteMany({
        where: { id: Number(id), tutorId },
    });
    res.json({ message: "Xóa lịch thành công" });
};

//6.	GET /api/tutor/booking-requests: xem danh sách đang chờ(tutor)
export const getPendingRequests = async (req, res) => {
    const tutorId = req.user.id;
    const requests = await prisma.requestBooking.findMany({
        where: { tutorId, status: "pending" },
        include: {
            student: { include: { user: { select: { name: true, ssoSub: true, faculty: true } } } },
        },
        orderBy: {createdAt: "desc"},
    });
    res.json({ requests});
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