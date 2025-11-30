import { getProfileFromDATACORE } from "../data/mockHcmut.js";
import { signToken } from "../utils/jwt.js";
import prisma from "../config/db.js";
import { syncUserAfterLogin } from "../middlewares/auth.js";

const ALLOWED_DOMAINS = ["student.hcmut.edu.vn", "hcmut.edu.vn"];

export const ssoLogin = async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Vui lòng cung cấp email HCMUT" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const domain = normalizedEmail.split("@")[1];

  if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
    return res.status(403).json({ message: "Chỉ chấp nhận email HCMUT (@student.hcmut.edu.vn hoặc @hcmut.edu.vn)" });
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
    }

    const token = signToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    const isProduction = process.env.NODE_ENV === "production";

    // ←←←←← ĐOẠN NÀY LÀ QUAN TRỌNG NHẤT – ĐÃ FIX HOÀN HẢO ←←←←←
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,                    // dev = false, prod = true
      sameSite: isProduction ? "none" : "lax", // dev dùng lax, prod dùng none
      domain: isProduction ? undefined : "localhost", // ← DÒNG CỨU CẢ DỰ ÁN KHI DÙNG VITE PROXY
      path: "/",                               // bắt buộc phải có
      maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 ngày
    });
    // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

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

// LOGOUT – CŨNG PHẢI ĐỒNG BỘ
export const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: isProduction ? undefined : "localhost", // ← cùng domain với lúc set
    path: "/",                                      // ← bắt buộc
  });

  res.json({ message: "Đăng xuất thành công" });
};