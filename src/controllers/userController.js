import prisma from "../config/db.js";

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Query DB, include tutor relation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tutor: true, // lấy status của tutor
      },
    });

    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      faculty: user.faculty,
      ssoSub: user.ssoSub,
      phoneNumber: user.phoneNumber || null,
      dateOfBirth: user.dateOfBirth || null,
      tutorStatus: user.tutor?.status || null,
    };

    return res.json({ message: "Lấy hồ sơ thành công", user: userResponse });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
