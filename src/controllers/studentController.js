import prisma from "../config/db.js";

// 4.	GET /api/availabilities: sinh viên xem slot trống
export const getAvailableSlots = async (req, res) => {
  const days = Number(req.query.days) || 14;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const future = new Date(today);
  future.setDate(today.getDate() + days);

  const schedules = await prisma.schedule.findMany({
    where: { isActive: true, tutor: { status: "approved" } },
    include: {
      tutor: { include: { user: { select: { name: true, faculty: true, ssoSub: true } } } },
    },
  });

  const slots = [];
  for (const sch of schedules) {
    let current = new Date(today);
    while (current <= future) {
      if (current.getDay() === sch.dayOfWeek) {
        const dateStr = current.toISOString().split("T")[0];
        const booked = await prisma.requestBooking.findFirst({
          where: {
            tutorId: sch.tutorId,
            preferredDate: new Date(dateStr),
            startTime: sch.startTime,
            status: { in: ["pending", "confirmed"] },
          },
        });
        if (!booked) {
          slots.push({
            tutorId: sch.tutorId,
            tutorName: sch.tutor.user.name,
            faculty: sch.tutor.user.faculty,
            mssv: sch.tutor.user.ssoSub,
            date: dateStr,
            startTime: sch.startTime,
            endTime: sch.endTime,
          });
        }
      }
      current.setDate(current.getDate() + 1);
    }
  }
  res.json({ total: slots.length, slots });
};

// 5.	POST api/bookings/request: chọn tutor + request của sinh viên 1:1
export const createBookingRequest = async (req, res) => {
  const { tutorId, preferredDate, startTime, endTime, subject, description } = req.body;
  const studentId = req.user.id;

  const conflict = await prisma.requestBooking.findFirst({
    where: {
      tutorId,
      preferredDate: new Date(preferredDate),
      startTime,
      status: { in: ["pending", "confirmed"] },
    },
  });
  if (conflict) return res.status(400).json({ message: "Thời gian đã có người đặt" });

  const booking = await prisma.requestBooking.create({
    data: {
      studentId,
      tutorId,
      subject,
      description,
      preferredDate: new Date(preferredDate),
      startTime,
      endTime,
    },
  });
  res.status(201).json({ message: "Gửi yêu cầu thành công", booking });
};

// 9.	GET /api/my/bookings: Lịch sử các buổi học
export const getMyBookings = async (req, res) => {
  const userId = req.user.id;
  const isTutor = req.user.role === "tutor";

  const bookings = await prisma.requestBooking.findMany({
    where: isTutor
      ? { tutorId: userId, status: { not: "pending" } }
      : { studentId: userId, status: { not: "pending" } },
    include: {
      tutor: { include: { user: { select: { name: true } } } },
      student: { include: { user: { select: { name: true } } } },
    },
    orderBy: { preferredDate: "desc" },
  });

  res.json({ bookings });
};