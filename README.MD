# Tutor Supporting System – Backend

Backend chính thức của hệ thống TSS – Full Express.js + Prisma 6.5.0 + SQL Server

## Tech Stack
- Node.js 18+
- Express.js 5
- Prisma ORM 6.5.0 (ổn định 100% với SQL Server)
- SQL Server 2019/2022/Express
- JWT + Bcrypt
- Cloudinary, Multer, Nodemailer, Helmet, Morgan, CORS

## Cấu trúc thư mục (MVC chuẩn)

```
src/
├── config/          # db.js, cloudinary.js,...
├── controllers/
├── middleware/      # auth.middleware.js, errorHandler.js
├── routes/
├── utils/           # jwt.js, mailer.js
├── server.js        # entry point
prisma/
├── schema.prisma
├── seed.js (tùy chọn)
```
## Cách chạy dự án

```bash
# 1. Clone + vào thư mục
git clone <https://github.com/HCMUT-TSS/Backend.git>
cd Tutor-Supporting-System/Backend

# 2. Cài dependencies
npm install
```

## Tạo file .env (copy từ .env.example hoặc dùng cái dưới)
```
# File .env:
# SQL Server
DATABASE_URL=sqlserver://localhost:1433;database=YourDatabaseName;user=sa;password=123;encrypt=true;trustServerCertificate=true

# App
PORT=5000
JWT_SECRET=supersecretjwtkey2025_change_in_production
JWT_EXPIRES_IN=7d
```

## Sync database (tạo bảng tự động)
```
npm run prisma:push

#Tạo admin(Chỉ cần dùng 1 lần duy nhất)
npm scripts/createAdmin.js

#Chạy server
npm run dev        
# hoặc
npm start
```
