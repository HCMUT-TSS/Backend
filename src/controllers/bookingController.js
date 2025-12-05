// controllers/bookingController.js
const requestBooking = (req, res) => {
  const { availabilityId, notes } = req.body;
  const slot = mockSlots.find(s => s.id === availabilityId);

  if (!slot || slot.isBooked) {
    return res.status(400).json({ message: 'Slot không khả dụng' });
  }

  const newRequest = {
    id: Date.now().toString(),
    student: { fullName: req.user.fullName, email: req.user.email },
    availabilityId,
    availability: { startTime: slot.startTime, endTime: slot.endTime },
    notes,
    status: 'PENDING'
  };

  mockRequests.push(newRequest);
  res.status(201).json({ message: 'Đã gửi yêu cầu đặt lịch!', request: newRequest });
};

const getMyBookings = (req, res) => {
  let bookings = [];

  if (req.user.role === 'student') {
    bookings = mockRequests
      .filter(r => r.student.email === req.user.email)
      .map(r => ({
        id: r.id,
        tutor: slot?.tutor || { fullName: 'Unknown' },
        availability: r.availability,
        status: r.status,
        notes: r.notes,
        meetingLink: r.meetingLink
      }));
  } else if (req.user.role === 'tutor') {
    bookings = mockRequests
      .filter(r => mockSlots.some(s => s.id === r.availabilityId && s.tutorId === req.user.id))
      .map(r => ({
        id: r.id,
        student: r.student,
        availability: r.availability,
        status: r.status,
        notes: r.notes
      }));
  }

  res.json(bookings);
};