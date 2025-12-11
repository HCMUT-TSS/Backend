import { getProfileFromDATACORE } from "../data/mockHcmut.js";
import { signToken } from "../utils/jwt.js";
import prisma from "../config/db.js";
import { syncUserAfterLogin } from "../middlewares/auth.js";

const ALLOWED_DOMAINS = ["student.hcmut.edu.vn", "hcmut.edu.vn"];
export const MOCK_PASSWORD = "123456";
export const ssoLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const domain = normalizedEmail.split("@")[1];

  if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
    return res.status(403).json({ message: "Chỉ chấp nhận email HCMUT (@student.hcmut.edu.vn hoặc @hcmut.edu.vn)" });
  }
  if (password !== MOCK_PASSWORD) {
    return res.status(401).json({
      message: "Sai mật khẩu!"
    });
  }
  try {
    const profile = getProfileFromDATACORE(normalizedEmail);
    await syncUserAfterLogin(profile);

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { student: true, tutor: true, admin: true },
    });

    const userData = {
      ssoSub: profile.ssoSub,
      ssoProvider: "hcmut",
      email: normalizedEmail,
      name: profile.name,
      faculty: profile.faculty,
      role: profile.role,
      phoneNumber: profile.phoneNumber,
      dateOfBirth: profile.dateOfBirth,
      admissionDate: profile.admissionDate,
    };

    if (!user) {
      user = await prisma.user.create({
        data: userData,
        include: { student: true, tutor: true, admin: true },
      });

    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: userData,
        include: { student: true, tutor: true, admin: true },
      });
      if (user.role === "student") {
        await prisma.student.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            mssv: user.email.split("@")[0],
            facultyCode: profile.facultyCode || "KHMT",
            majorCode: profile.majorCode || "KTPM",
            classCode: profile.classCode || null,
            gpa: null,
            credits: null,
          },
        });
      }

      if (user.role === "tutor") {
        await prisma.tutor.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            status: "pending",
          },
        });
      }
    }

    const token = signToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,    
      sameSite: isProduction ? "none" : "lax", 
      domain: isProduction ? undefined : "localhost", 
      path: "/",          
      maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 ngày
    });

    return res.json({
      message: "Đăng nhập HCMUT SSO thành công!",
      user: {
        id: user.id,
        ssoSub: user.ssoSub,
        name: user.name,
        email: user.email,
        role: user.role,
        faculty: user.faculty,
        isTutor: !!user.tutor,
        tutorStatus: user.tutor?.status || null,
        isAdmin: !!user.admin,
      },
    });
  } catch (error) {
    console.error("SSO Login Error:", error.message);
    return res.status(401).json({
      message: error.message || "Email không tồn tại trong hệ thống Bách Khoa",
    });
  }
};

export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: isProduction ? undefined : "localhost",
    path: "/",                                      
  });

  res.json({ message: "Đăng xuất thành công" });
};