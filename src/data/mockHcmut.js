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
    name: "Phòng Công tác sinh viên",
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


// ------------------------------------------------------------------------------------
//                                MOCK SCHEDULE DATA
// ------------------------------------------------------------------------------------

/**
 * @typedef {object} Tutor
 * @property {number} id
 * @property {string} name
 * @property {string} subject
 * @property {boolean} available
 */

/**
 * @typedef {object} AvailabilitySlot
 * @property {number} id
 * @property {number} tutorId
 * @property {string} tutorName
 * @property {string} date // YYYY-MM-DD
 * @property {string} time // HH:MM - HH:MM
 * @property {boolean} booked
 */

/**
 * @typedef {object} GroupSession
 * @property {number} id
 * @property {string} title
 * @property {string} tutor
 * @property {string} date
 * @property {string} time
 * @property {string} location
 * @property {'online' | 'offline'} type
 * @property {number} enrolled
 * @property {number} maxParticipants
 * @property {string} program
 * @property {string} subject
 */

/**
 * @typedef {object} OneOnOneRequest
 * @property {number} id
 * @property {string} studentName
 * @property {string} studentId
 * @property {string} subject
 * @property {string} preferredDate
 * @property {string} preferredTime
 * @property {'online' | 'offline'} type
 * @property {string} [location]
 * @property {'pending' | 'approved' | 'rejected'} status
 * @property {string} note
 */

/**
 * @typedef {object} StudentBooking
 * @property {number} id
 * @property {'1-1' | 'group'} type
 * @property {string} tutor
 * @property {string} date
 * @property {string} time
 * @property {string} subject
 * @property {string} location
 * @property {'confirmed' | 'pending'} status
 */


// 1. Danh sách Tutors
/** @type {Tutor[]} */
export const MOCK_TUTORS = [
  { id: 1, name: 'Nguyễn Minh Tâm', subject: 'Lập trình C++, Cấu trúc dữ liệu', available: true },
  { id: 2, name: 'Nguyễn Phúc Gia Khiêm', subject: 'Giải tích, Đại số tuyến tính', available: true },
  { id: 3, name: 'Trần Trung Toàn', subject: 'Mạch điện, Điện tử cơ bản', available: true },
  { id: 4, name: 'Phạm Văn D', subject: 'Vật lý đại cương', available: false },
];

// 2. Lịch rảnh của Tutors (Tutor Availability)
/** @type {AvailabilitySlot[]} */
export const MOCK_TUTOR_AVAILABILITY = [
  // Tutor: Nguyễn Minh Tâm (id: 1)
  { id: 101, tutorId: 1, tutorName: 'Nguyễn Minh Tâm', date: '2025-12-01', time: '10:00 - 12:00', booked: false },
  { id: 102, tutorId: 1, tutorName: 'Nguyễn Minh Tâm', date: '2025-12-02', time: '14:00 - 16:00', booked: true }, // Đã bị đặt
  { id: 103, tutorId: 1, tutorName: 'Nguyễn Minh Tâm', date: '2025-12-03', time: '08:00 - 10:00', booked: false },

  // Tutor: Nguyễn Phúc Gia Khiêm (id: 2)
  { id: 201, tutorId: 2, tutorName: 'Nguyễn Phúc Gia Khiêm', date: '2025-12-01', time: '16:00 - 18:00', booked: false },
  { id: 202, tutorId: 2, tutorName: 'Nguyễn Phúc Gia Khiêm', date: '2025-12-04', time: '09:00 - 11:00', booked: false },
  
  // Tutor: Trần Trung Toàn (id: 3)
  { id: 301, tutorId: 3, tutorName: 'Trần Trung Toàn', date: '2025-12-05', time: '19:00 - 21:00', booked: false },
  
  // Tutor: Phạm Văn D (id: 4)
  { id: 401, tutorId: 4, tutorName: 'Phạm Minh Tuấn', date: '2025-12-06', time: '13:00 - 15:00', booked: false },
];

// 3. Danh sách Session nhóm (Group Sessions)
/** @type {GroupSession[]} */
export const MOCK_GROUP_SESSIONS = [
  {
    id: 1,
    title: 'Lập trình C++ - Ôn tập Cơ bản',
    tutor: 'Nguyễn Minh Tâm',
    subject: 'Lập trình C++',
    date: '2025-12-01',
    time: '14:00 - 16:00',
    location: 'Phòng H1-302',
    type: 'offline',
    enrolled: 8,
    maxParticipants: 15,
    program: 'Chương trình hỗ trợ học tập K23',
  },
  {
    id: 2,
    title: 'Giải tích 1 - Giới hạn và Đạo hàm',
    tutor: 'Nguyễn Phúc Gia Khiêm',
    subject: 'Giải tích',
    date: '2025-12-05',
    time: '09:00 - 11:00',
    location: 'Google Meet Link',
    type: 'online',
    enrolled: 12,
    maxParticipants: 20,
    program: 'Chương trình hỗ trợ học tập K22',
  },
  {
    id: 3,
    title: 'Làm quen với Mạch Điện',
    tutor: 'Trần Trung Toàn',
    subject: 'Mạch điện',
    date: '2025-12-03',
    time: '19:00 - 21:00',
    location: 'Zoom Meeting',
    type: 'online',
    enrolled: 5,
    maxParticipants: 10,
    program: 'Chương trình hỗ trợ học tập K23',
  },
];

// 4. Danh sách Yêu cầu 1-1 (One-on-One Requests)
/** @type {OneOnOneRequest[]} */
export const MOCK_ONE_ON_ONE_REQUESTS = [
  {
    id: 1,
    studentName: 'Nguyễn Mai Huy Phát',
    studentId: '2312589',
    subject: 'Cấu trúc dữ liệu - Linked List',
    preferredDate: '2025-12-04',
    preferredTime: '14:00 - 15:30',
    type: 'online',
    status: 'pending',
    note: 'Cần hướng dẫn code bài tập về Linked List',
  },
  {
    id: 2,
    studentName: 'Hồng Phi Trường',
    studentId: '2313703',
    subject: 'Giải tích - Tích phân cơ bản',
    preferredDate: '2025-12-06',
    preferredTime: '09:00 - 10:30',
    type: 'offline',
    location: 'Phòng H1-302',
    status: 'pending',
    note: 'Gặp khó khăn với các dạng bài tập tích phân cơ bản',
  },
  {
    id: 3,
    studentName: 'Hồ Anh Duy',
    studentId: '2310460',
    subject: 'Vật lý - Định luật bảo toàn cơ năng',
    preferredDate: '2025-12-07',
    preferredTime: '13:00 - 14:00',
    type: 'online',
    status: 'approved',
    note: 'Đã chấp thuận. Chuẩn bị tài liệu ôn tập.',
  },
];

// 5. Danh sách Đăng ký tạm thời của Sinh viên (Student Bookings)
/** @type {StudentBooking[]} */
export const MOCK_STUDENT_BOOKINGS = [
  {
    id: 1,
    type: '1-1',
    tutor: 'Nguyễn Minh Tâm',
    date: '2025-12-02',
    time: '14:00 - 15:30',
    subject: 'Lập trình C++ - OOP',
    location: 'Google Meet',
    status: 'confirmed',
  },
  {
    id: 2,
    type: 'group',
    tutor: 'Nguyễn Phúc Gia Khiêm',
    date: '2025-12-05',
    time: '09:00 - 11:00',
    subject: 'Giải tích 1 - Giới hạn và Đạo hàm',
    location: 'Google Meet Link',
    status: 'confirmed',
  },
];