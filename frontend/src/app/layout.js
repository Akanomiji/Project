import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar' // ✅ 1. นำเข้า Navbar
import SessionProviderWrapper from '@/components/SessionProviderWrapper' // (ถ้ามี)

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PhishWise - AI Security',
  description: 'ตรวจสอบความปลอดภัยเว็บไซต์',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <SessionProviderWrapper> {/* ถ้าคุณใช้ NextAuth */}
          
          <Navbar /> {/* ✅ 2. วาง Navbar ตรงนี้ ตัวเดียวจบ ครบทุกหน้า! */}
          
          {children}
          
        </SessionProviderWrapper>
      </body>
    </html>
  )
}