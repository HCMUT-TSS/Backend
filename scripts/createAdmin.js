import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@edu.vn';
  const password = '123456';
  const name = 'Quản trị viên';

  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) {
    console.log('Admin đã tồn tại rồi!');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      role: 'admin'
    }
  });

  await prisma.admin.create({
    data: { userId: user.id }
  });

  console.log('Tạo admin thành công!');
  console.log(`Email: ${email}`);
  console.log(`Mật khẩu: ${password}`);
  process.exit(0);
}

createAdmin();