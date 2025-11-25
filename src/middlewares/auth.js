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