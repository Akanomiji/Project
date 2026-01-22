const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('123456', 10)

  // 1. สร้าง Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin User',
      password: password,
      role: 'ADMIN',
    },
  })

  // 2. สร้าง Member User (เพิ่มส่วนนี้เข้ามาครับ)
  const member = await prisma.user.upsert({
    where: { email: 'member@test.com' },
    update: {},
    create: {
      email: 'member@test.com',
      name: 'Member User',
      password: password,
      role: 'MEMBER',
    },
  })

  console.log('✅ Seeding ข้อมูลเสร็จเรียบร้อย!')
  console.log({ admin, member })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })