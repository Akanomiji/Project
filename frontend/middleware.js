import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // เช็คสิทธิ์: ถ้าจะเข้าหน้า admin แต่ไม่ใช่ ADMIN ให้ดีดกลับ
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // ต้อง Login ก่อนถึงจะผ่านได้
    },
  }
)

// ระบุหน้าที่ต้องการป้องกัน
export const config = { matcher: ["/admin/:path*", "/dashboard/:path*"] }