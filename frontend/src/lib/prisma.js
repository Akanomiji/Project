import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient() // ไม่ต้องใส่ option อะไรเลย มันจะอ่านจาก schema เอง
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma || prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma