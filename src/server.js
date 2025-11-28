import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prismaPromise from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import tutorRoutes from './routes/tutor.js';
import studentRoutes from './routes/student.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/tutor", tutorRoutes);
app.use('/api/student', studentRoutes);

//Check health
app.get('/health', (req, res) => {
  res.json({ message: 'TTS Backend NodeJS + Prisma 6.5 + SQL Server Running' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Tutor Supporting System Backend Running successful!',
    status: 'OK',
    prisma: 'Connected',
    time: new Date().toLocaleString('vi-VN')
  });
});

//Test DB
app.get('/test-db', async (req, res) => {
  try {
    const prisma = await prismaPromise;
    const count = await prisma.user.count();
    res.json({
      success: true,
      userCount: count,
      message: 'DB Connection + Prisma success!',
    });
  } catch (error) {
    console.error('Error DB Test:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//Port 5000
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
  console.log(`Test DB: http://localhost:${PORT}/test-db`);
});

