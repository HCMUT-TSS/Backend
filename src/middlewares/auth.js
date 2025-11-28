import { verifyToken } from '../utils/jwt.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const protect = async (req, res, next) => {
  let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Please login first" });

  try {
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) return res.status(401).json({ message: "Error Token" });
    req.user = user;
    next();
  }
  catch (err) {
    return res.status(401).json({ message: "Expired Token" })
  }
}

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa đăng nhập' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập!' });
    }
    next();
  };
};

export const syncUserAfterLogin = async (profileFromDATACORE) => {
  const { ssoSub, email, name, faculty, role, phoneNumber, dateOfBirth, admissionDate } = profileFromDATACORE;

  // Tìm hoặc tạo User
  let user = await prisma.user.findUnique({
    where: { ssoSub },
    include: { tutor: true, admin: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        ssoSub,
        email,
        name,
        faculty,
        phoneNumber,
        dateOfBirth,
        admissionDate,
        role: role === 'admin' ? 'admin' : 'student',
      },
    });
  } else {
    // Cập nhật thông tin mới nhất từ DATACORE
    await prisma.user.update({
      where: { ssoSub },
      data: { name, email, faculty, phoneNumber, dateOfBirth, admissionDate },
    });
  }

  //Nếu DATACORE trả role = "tutor" → đảm bảo có bản ghi Tutor
  if (role === 'tutor') {
    if (!user.tutor) {
      // Chưa từng có → tạo mới với trạng thái pending (lần đầu đăng ký)
      await prisma.tutor.create({
        data: {
          userId: user.id,
          status: 'pending',
          appliedAt: new Date(),
        },
      });
    }
    // Nếu đã có tutor rồi → giữ nguyên status (approved/rejected/pending)
  }

  // Nếu là admin → tạo bản ghi Admin nếu chưa có
  if (role === 'admin' && !user.admin) {
    await prisma.admin.create({
      data: { userId: user.id } });
  }

  // Cập nhật role User
  if (role === 'tutor' || role === 'admin') {
    await prisma.user.update({
      where: { id: user.id },
      data: { role },
    });
  }

  return user;
};