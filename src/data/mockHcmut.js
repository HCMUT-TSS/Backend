const HCMUT_DATABASE = {
  // ────────────────────── SINH VIÊN THƯỜNG ──────────────────────
  "2512345": {
    name: "Nguyễn Văn An",
    email: "2512345@student.hcmut.edu.vn",
    role: "student",
    faculty: "Khoa Học và Kỹ thuật Máy tính",
    phoneNumber: "0901234567",
    dateOfBirth: "2003-05-15",
    admissionDate: "2021-09-01",
  },

  // ────────────────────── SINH VIÊN LÀM TUTOR ──────────────────────
  "2234567": {
    name: "Trần Thị Bé",
    email: "2234567@student.hcmut.edu.vn",
    role: "tutor",
    faculty: "Kỹ thuật Điện - Điện tử",
    phoneNumber: "0912345678",
    dateOfBirth: "2002-11-20",
    admissionDate: "2022-09-01",
  },

  // ────────────────────── GIẢNG VIÊN / ADMIN ──────────────────────
  "GV12345": {
    name: "TS. Nguyễn Văn Admin",
    email: "admin@hcmut.edu.vn",
    role: "admin",
    faculty: "Phòng Đào tạo Sau đại học",
    phoneNumber: "02873001234",
    dateOfBirth: "1985-03-10",
    admissionDate: null,
  },

  "GV99999": {
    name: "PGS.TS. Giám Đốc TTS",
    email: "director@hcmut.edu.vn",
    role: "admin",
    faculty: "Ban Giám hiệu",
    phoneNumber: "02873009999",
    dateOfBirth: "1975-07-20",
    admissionDate: null,
  },

  // ────────────────────── Phân trang(test) ──────────────────────
  "2411111": { name: "Lê Hoàng C", email: "2411111@student.hcmut.edu.vn", role: "student", faculty: "Cơ khí", phoneNumber: "0923456789", dateOfBirth: "2003-01-10", admissionDate: "2021-09-01" },
  "2422222": { name: "Phạm Minh D", email: "2422222@student.hcmut.edu.vn", role: "tutor",   faculty: "Hóa học", phoneNumber: "0934567890", dateOfBirth: "2002-08-25", admissionDate: "2022-09-01" },
};

export const getProfileFromDATACORE = (email) => {
  const normalized = email.trim().toLowerCase();

  const entry = Object.entries(HCMUT_DATABASE).find(
    ([_, profile]) => profile.email.toLowerCase() === normalized
  );

  if (!entry) {
    throw new Error("Không tìm thấy người dùng trong hệ thống HCMUT_DATACORE");
  }

  const [ssoSub, data] = entry;

  return {
    ssoSub,
    name: data.name,
    email: data.email,
    faculty: data.faculty,
    role: data.role,
    phoneNumber: data.phoneNumber || null,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
    admissionDate: data.admissionDate ? new Date(data.admissionDate) : null,
  };
};