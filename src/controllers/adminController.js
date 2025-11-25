import prisma from '../config/db.js';

// Get tutor pending list
export const getPendingTutors = async (req, res) => {
  const tutors = await prisma.tutor.findMany({
    where: { status: "pending" },
    include: {
      user: {
        select: { id: true, name: true, email: true, phoneNumber: true, faculty: true }
      }
    },
    orderBy: { appliedAt: "desc" }
  });
  res.json(tutors);
};

// Approve tutor
export const approveTutor = async (req, res) => {
  const { tutorId } = req.params;

  const tutor = await prisma.tutor.update({
    where: { userId: Number(tutorId) },
    data: {
      status: "approved",
      approvedAt: new Date()
    },
    include: { user: { select: { name: true, email: true } } }
  });

  res.json({ message: `Đã duyệt tutor ${tutor.user.name} thành công!`, tutor });
};

// Reject tutor
export const rejectTutor = async (req, res) => {
  const { tutorId } = req.params;

  const tutor = await prisma.tutor.update({
    where: { userId: Number(tutorId) },
    data: { status: "rejected" }
  });

  res.json({ message: "Đã từ chối tutor", tutor });
};