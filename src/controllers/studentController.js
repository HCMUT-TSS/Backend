import prisma from "../config/db.js";

// 4.	GET /api/availabilities: sinh viên xem slot trống
export const getAvailableSlots = async (req, res) => {
  const days = Number(req.query.days) || 14;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const future = new Date(today);
  future.setDate(today.getDate() + days);

  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        isActive: true,
        tutor: { status: "approved" },
      },
      include: {
        tutor: {
          include: {
            user: {
              select: { name: true, faculty: true, ssoSub: true }
            }
          }
        }
      },
    });

    const slots = [];

    for (const sch of schedules) {
      let current = new Date(today);

      while (current <= future) {
        // Chuyển Chủ Nhật (0) thành 7 để so sánh với dayOfWeek trong DB
        const currentDay = current.getDay() === 0 ? 7 : current.getDay();

        if (currentDay === sch.dayOfWeek) {
          const dateStr = current.toISOString().split('T')[0];

          // Kiểm tra đã có ai đặt chưa
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
              faculty: sch.tutor.user.faculty || null,
              mssv: sch.tutor.user.ssoSub,
              date: dateStr,
              startTime: sch.startTime,
              endTime: sch.endTime,
              // TRẢ VỀ ĐẦY ĐỦ THÔNG TIN CHO FRONTEND
              title: sch.title || "Tư vấn 1:1",
              location: sch.location || null,
              meetingType: sch.meetingType || null,
              meetLink: sch.meetLink || null,
            });
          }
        }
        current.setDate(current.getDate() + 1);
      }
    }

    res.json({ 
      total: slots.length, 
      slots 
    });
  } catch (error) {
    console.error("Lỗi lấy slot rảnh:", error);
    res.status(500).json({ message: "Lỗi server khi tải lịch" });
  }
};

// 5. POST api/bookings/request
export const createBookingRequest = async (req, res) => {
  try {
    // 1. THÊM 'location' VÀO ĐÂY
    const { tutorId, preferredDate, startTime, endTime, subject, description, location } = req.body; 
    const studentId = req.user.id;

    // Check trùng lịch (giữ nguyên)
    const conflict = await prisma.requestBooking.findFirst({
      where: {
        tutorId,
        preferredDate: new Date(preferredDate),
        startTime,
        status: { in: ["pending", "confirmed"] },
      },
    });
    if (conflict) return res.status(400).json({ message: "Thời gian đã có người đặt" });

    // Tạo booking
    const booking = await prisma.requestBooking.create({
      data: {
        studentId,
        tutorId,
        subject,
        description,
        preferredDate: new Date(preferredDate),
        startTime,
        endTime,
        location: location || "Online", // 2. LƯU LOCATION VÀO DB (Nếu không có thì mặc định Online)
      },
    });

    res.status(201).json({ message: "Gửi yêu cầu thành công", booking });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Lỗi server khi đặt lịch" });
  }
};

// 9.	GET /api/my/bookings: Lịch sử các buổi học
export const getMyBookings = async (req, res) => {
  const userId = req.user.id;

  const bookings = await prisma.requestBooking.findMany({
    where: { studentId: userId },
    include: {
      tutor: {
        include: {
          user: { select: { name: true, faculty: true } }
        }
      }
    },
    orderBy: { preferredDate: "desc" },
  });

  // ĐÚNG ĐỊNH DẠNG MÀ FRONTEND ĐANG CHỜ: tutorName, location, note, meetLink...
  const formattedBookings = bookings.map(booking => ({
    id: booking.id,
    tutorName: booking.tutor?.user?.name || "Gia sư chưa xác định",
    tutorId: booking.tutorId,
    date: booking.preferredDate.toISOString().split('T')[0],
    startTime: booking.startTime,
    endTime: booking.endTime,
    status: booking.status,
    location: booking.location || null,
    note: booking.description || null,
    meetLink: booking.meetLink || null,
  }));

  res.json({ bookings: formattedBookings });
};