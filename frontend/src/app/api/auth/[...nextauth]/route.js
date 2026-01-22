import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma" // เรียกใช้จากไฟล์กลาง (Best Practice)
import bcrypt from "bcryptjs"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // 1. ค้นหา User ใน Database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        // 2. เช็ค Password (เทียบรหัสที่กรอก กับ Hash ใน Db)
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // 3. ถ้าผ่าน ส่งข้อมูล User กลับไป (ไม่รวม password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // ส่ง Role ไปด้วย เพื่อใช้เช็คสิทธิ์
        }
      }
    })
  ],
callbacks: {
    // 1. ตอนสร้าง Token ให้เอา role ใส่เข้าไปด้วย
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; 
      }
      return token;
    },
    // 2. ตอนส่ง Session ไปหน้าเว็บ ให้เอา role จาก Token ใส่เข้าไป
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.sub; // เผื่อใช้ id ด้วย
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // บอก NextAuth ว่าหน้า Login ของเราอยู่ที่ไหน
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-me", // จริงๆ ควรตั้งใน .env
})

export { handler as GET, handler as POST }