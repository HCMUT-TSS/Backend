// ====================================================================================
// FILE: mockHcmut.js
// Mục đích: Cung cấp dữ liệu giả lập (mock data) cho cả hồ sơ người dùng (HCMUT_DATABASE) 
//          và dữ liệu lịch trình/session cho ứng dụng.
// ====================================================================================

/**
 * @typedef {'student' | 'tutor' | 'admin' | 'coordinator'} UserRole
 * * @typedef {object} UserProfile
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {string} faculty
 * @property {string} [phoneNumber]
 * @property {string} [dateOfBirth] // YYYY-MM-DD
 * @property {string | null} [admissionDate] // YYYY-MM-DD
 * * @typedef {object} ProfileResult
 * @property {string} ssoSub // MSSV hoặc mã định danh
 * @property {string} name
 * @property {string} email
 * @property {string} faculty
 * @property {UserRole} role
 * @property {string | null} phoneNumber
 * @property {Date | null} dateOfBirth
 * @property {Date | null} admissionDate
 */


/** @type {Object.<string, UserProfile>} */
export const HCMUT_DATABASE = {
  // ────────────────────── SINH VIÊN THƯỜNG ──────────────────────
  "2312589": {
    name: "Nguyễn Mai Huy Phát",
    email: "phat.nguyenchlorcale@hcmut.edu.vn",
    role: "student",
    faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
    phoneNumber: "09498143527",
    dateOfBirth: "2005-08-21",
    admissionDate: "2023-10-01",
  },

  "2312701": {
    name: "Nguyễn Minh Phúc",
    email: "phuc.nguyenphucnm266@hcmut.edu.vn",
    role: "student",
    faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
    phoneNumber: "0912563478",
    dateOfBirth: "2005-06-26",
    admissionDate: "2023-10-01",
  },
  "2313354": {
    name: "Nguyễn Minh Thuận",
    email: "thuan.nguyenminh2485@hcmut.edu.vn",
    role: "student",
    faculty: "Khoa kỹ thuật giao thông",
    phoneNumber: "0978563412",
    dateOfBirth: "2005-01-01",
    admissionDate: "2023-10-01",
  },
  "2310460": {
    name: "Hồ Anh Duy",
    email: "duy.hoanh98hcmut@hcmut.edu.vn",
    role: "student",
    faculty: "Khoa cơ khí",
    phoneNumber: "0338593405",
    dateOfBirth: "2005-08-08",
    admissionDate: "2023-10-01",
  },
  "2313703": {
    name: "Hồng Phi Trường",
    email: "truong.hongphi@hcmut.edu.vn",
    role: "student",
    faculty: "Khoa Khoa học và Kỹ thuật máy tính",
    phoneNumber: "0945227661",
    dateOfBirth: "2005-11-23",
    admissionDate: "2023-10-01",
  },

  // ────────────────────── SINH VIÊN LÀM TUTOR ──────────────────────
  "2114719": {
    name: "Nguyễn Minh Tâm",
    email: "tam.nguyen272@hcmut.edu.vn",
    role: "tutor",
    faculty: "Khoa Khoa học và Kỹ thuật máy tính",
    phoneNumber: "0912345678",
    dateOfBirth: "2003-01-01",
    admissionDate: "2021-09-01",
  },
  "2211572": {
    name: "Nguyễn Phúc Gia Khiêm",
    email: "khiem.nguyenphucgia@hcmut.edu.vn",
    role: "tutor",
    faculty: "Khoa Khoa học và Kỹ thuật máy tính",
    phoneNumber: "0912345678",
    dateOfBirth: "2004-01-01",
    admissionDate: "2022-09-01",
  },
  "2151265": {
    name: "Trần Trung Toàn",
    email: "toan.trantrung@hcmut.edu.vn",
    role: "tutor",
    faculty: "Khoa Điện - Điện tử",
    phoneNumber: "0912345678",
    dateOfBirth: "2003-01-01",
    admissionDate: "2021-09-01",
  },
  // Thêm tutor để đủ 4 người như mock trước
  "2210467": { 
    name: "Phạm Minh Tuấn",
    email: "pmtuan@hcmut.edu.vn",
    role: "tutor",
    faculty: "Khoa Kỹ thuật địa chất và dầu khí",
    phoneNumber: "0912345678",
    dateOfBirth: "2004-01-01",
    admissionDate: "2022-09-01",
  },


  // ────────────────────── GIẢNG VIÊN / ADMIN ──────────────────────
  "KhoaMayTinh": {
    name: "Khoa Khoa học và Kỹ thuật Máy Tính",
    email: "kkhktmt@hcmut.edu.vn",
    role: "admin",
    faculty: "Khoa KH&KT Máy Tính",
    phoneNumber: "02838638912",
    dateOfBirth: "1993-01-01",
    admissionDate: null,
  },
  "PhongCTSV": {
    name: "Phòng Công tác sinh viên",
    email: "ctsv@hcmut.edu.vn",
    role: "admin",
    faculty: "Phòng Công tác sinh viên",
    phoneNumber: "02838647256",
    dateOfBirth: "1957-10-27",
    admissionDate: null,
  },

  "TruongPDT": {
    name: "PGS.TS. Bùi Hoài Thắng",
    email: "bhthang@hcmut.edu.vn",
    role: "admin",
    faculty: "Trưởng Phòng đào tạo",
    phoneNumber: "38658689",
    dateOfBirth: "1973-08-21",
    admissionDate: null,
  },

  "TruongKhoa": {
    name: "PGS.TS. Quản Thành Thơ",
    email: "qttho@hcmut.edu.vn",
    role: "admin",
    faculty: "Trưởng Khoa Khoa học và Kỹ thuật máy tính",
    phoneNumber: "38647256",
    dateOfBirth: "1957-04-07",
    admissionDate: null,
  },

};

/**
 * Tra cứu thông tin hồ sơ từ cơ sở dữ liệu giả lập (HCMUT_DATABASE).
 * @param {string} email - Email của người dùng.
 * @returns {ProfileResult}
 */
export const getProfileFromDATACORE = (email) => {
  const normalized = email.trim().toLowerCase();
  console.log(`\n[MOCK DATACORE] Tra cứu hồ sơ từ HCMUT_DATACORE`);
  console.log(`   Email: ${email}`);
  console.log(`   Thời gian: ${new Date().toLocaleString('vi-VN')}`);
  console.log(`   Đang tìm trong ${Object.keys(HCMUT_DATABASE).length} bản ghi mock...`);
  const entry = Object.entries(HCMUT_DATABASE).find(
    ([_, profile]) => profile.email.toLowerCase() === normalized
  );

  if (!entry) {
    throw new Error("Không tìm thấy người dùng trong hệ thống HCMUT_DATACORE");
  }

  const [ssoSub, data] = entry;
  console.log(`[MOCK DATACORE] Tìm thấy! → Trả về hồ sơ`);
  console.log(`   MSSV/Mã GV: ${ssoSub}`);
  console.log(`   Họ tên: ${data.name}`);
  console.log(`   Vai trò: ${data.role}`);
  console.log(`   Khoa: ${data.faculty}\n`);
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


export const HCMUT_LIBRARY = [
  { title: "Bài giảng Toán Cơ bản", url: "library.hcmut.edu.vn/toan-co-ban.pdf", subject: "Toán" },
  { title: "Hướng dẫn Lập trình C++", url: "library.hcmut.edu.vn/cpp-guide.pdf", subject: "Lập trình" },
  { title: "Tài liệu Vật lý Đại cương", url: "library.hcmut.edu.vn/vat-ly.pdf", subject: "Vật lý" },
  // Thêm nhiều hơn để mock
];

// Hàm mock tài liệu ngẫu nhiên cho session
export const getMockMaterials = (subject = "") => {
  const filtered = HCMUT_LIBRARY.filter(item => item.subject.toLowerCase().includes(subject.toLowerCase()));
  return filtered.length > 0 ? filtered.slice(0, 2) : HCMUT_LIBRARY.slice(0, 2); // Mock 2 tài liệu
};