import prisma from '../config/db.js';

//Danh sách tutor đang chờ duyệt
export const getPendingTutors = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [tutors, total] = await Promise.all([
    prisma.tutor.findMany({
      where: { status: "pending" },
      include: {
        user: {
          select: {
            id: true,
            ssoSub: true,
            name: true,
            email: true,
            phoneNumber: true,
            faculty: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.tutor.count({ where: { status: "pending" } }),
  ]);

  res.json({
    data: tutors,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

//Duyệt tutor
export const approveTutor = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Cập nhật trạng thái tutor
      const tutor = await tx.tutor.update({
        where: { userId: Number(userId) },
        data: {
          status: "approved",
          approvedAt: new Date(),
        },
        include: {
          user: {
            select: { name: true, email: true, ssoSub: true },
          },
        },
      });
      await tx.user.update({
        where: { id: Number(userId) },
        data: { role: "tutor" },
      });

      return tutor;
    });

    res.json({
      message: `Đã duyệt thành công tutor ${result.user.name} (MSSV: ${result.user.ssoSub})`,
      tutor: result,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Không tìm thấy tutor hoặc đã được xử lý" });
  }
};

//Từ chối tutor
export const rejectTutor = async (req, res) => {
  const { userId } = req.params;

  try {
    const tutor = await prisma.tutor.update({
      where: { userId: Number(userId) },
      data: {
        status: "rejected",
        rejectedAt: new Date(),
      },
      include: {
        user: { select: { name: true, email: true, ssoSub: true } },
      },
    });
    res.json({
      message: `Đã từ chối tutor ${tutor.user.name}`,
      tutor,
    });
  } catch (error) {
    res.status(404).json({ message: "Không tìm thấy tutor" });
  }
};