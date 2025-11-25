import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

// ==================== ĐĂNG KÝ SINH VIÊN ====================
export const registerStudent = async (req, res) => {
  const {
    email, password, name, phoneNumber,
    dateOfBirth, admissionDate, faculty, mssv
  } = req.body;

  if (!email || !password || !name || !mssv) {
    return res.status(400).json({ message: "Email, mật khẩu, họ tên và MSSV là bắt buộc" });
  }

  const mssvTrimmed = mssv.trim();
  if (mssvTrimmed.length < 6 || mssvTrimmed.length > 20) {
    return res.status(400).json({ message: "MSSV không hợp lệ" });
  }

  const [emailExist, mssvExist] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.student.findFirst({ where: { mssv: mssvTrimmed } })
  ]);

  if (emailExist) return res.status(400).json({ message: "Email đã được sử dụng" });
  if (mssvExist) return res.status(400).json({ message: "MSSV đã tồn tại" });

  const hashed = hashPassword(password);

  try {
    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashed,
          name: name.trim(),
          phoneNumber: phoneNumber?.trim() || null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          admissionDate: admissionDate ? new Date(admissionDate) : null,
          faculty: faculty?.trim() || null,
          role: "student"
        }
      });

      await tx.student.create({
        data: {
          userId: user.id,
          mssv: mssvTrimmed,
          faculty: faculty?.trim() || null
        }
      });

      return user;
    });

    const token = signToken({ id: user.id, role: "student" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { password: _, ...safeUser } = user;
    return res.status(201).json({
      message: "Đăng ký sinh viên thành công!",
      user: safeUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// ==================== ĐĂNG KÝ TUTOR ====================
export const registerTutor = async (req, res) => {
  const { email, password, name, phoneNumber, dateOfBirth, faculty } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Email, mật khẩu và họ tên là bắt buộc" });
  }

  if (await prisma.user.findUnique({ where: { email } })) {
    return res.status(400).json({ message: "Email đã được sử dụng" });
  }

  const hashed = hashPassword(password);

  try {
    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashed,
          name: name.trim(),
          phoneNumber: phoneNumber?.trim() || null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          faculty: faculty?.trim() || null,
          role: "tutor"
        }
      });

      await tx.tutor.create({
        data: {
          userId: user.id,
          status: "pending"
        }
      });

      return user;
    });

    const token = signToken({ id: user.id, role: "tutor" });
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });

    const { password: _, ...safeUser } = user;
    return res.status(201).json({
      message: "Đăng ký làm tutor thành công! Hồ sơ đang chờ duyệt.",
      user: safeUser,
      tutorStatus: "pending"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Nhập email và mật khẩu" });

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true, email: true, name: true, role: true, password: true,
      phoneNumber: true, dateOfBirth: true, admissionDate: true, faculty: true,
      student: true,
      tutor: true
    }
  });

  if (!user || !comparePassword(password, user.password)) {
    return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
  }

  const { password: _, ...safeUser } = user;
  const token = signToken({ id: user.id, role: user.role });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.json({ message: "Đăng nhập thành công", user: safeUser });
};

// ==================== ME ====================
export const me = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true, email: true, name: true, role: true,
      phoneNumber: true, dateOfBirth: true, admissionDate: true, faculty: true,
      student: true,
      tutor: true
    }
  });

  return res.json({ user });
};

//----------------- LOGOUT ====================
export const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
  res.json({ message: "Đăng xuất thành công" });
};