import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error'],
});
async function disconnectPrisma() {
  await prisma.$disconnect();
}
process.on('SIGINT', disconnectPrisma);
process.on('SIGTERM', disconnectPrisma);

export default prisma;