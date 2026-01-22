"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ShieldCheck, Menu, X, User, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ สูตรคำนวณลิงก์ Dashboard (Admin ไป /admin, Member ไป /dashboard)
  const dashboardLink = session?.user?.role === 'ADMIN' ? '/admin' : '/dashboard';
  const dashboardText = session?.user?.role === 'ADMIN' ? 'Admin Panel' : 'Member Dashboard';

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-blue-600">
              <ShieldCheck size={32} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              PhishWise
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition">หน้าหลัก</Link>
            <Link href="/knowledge" className="hover:text-blue-600 transition">ความรู้ไซเบอร์</Link>
            
            <div className="h-5 w-px bg-slate-300 mx-2"></div>

            {session ? (
              <div className="flex items-center gap-4">
                {/* ปุ่มไป Dashboard ตาม Role */}
                <Link 
                  href={dashboardLink} 
                  className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition font-semibold"
                >
                  <LayoutDashboard size={18} />
                  <span>{dashboardText}</span>
                </Link>
                
                <div className="flex items-center gap-2 text-slate-500 text-xs border-l border-slate-200 pl-4">
                    <User size={14} />
                    <span className="max-w-[100px] truncate">{session.user.name || "User"}</span>
                </div>

                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-slate-500 hover:text-red-500 transition font-semibold text-sm"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-slate-600 hover:text-blue-600 font-semibold">
                  เข้าสู่ระบบ
                </Link>
                <Link href="/register">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm shadow-blue-200">
                    สมัครสมาชิก
                    </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-blue-600">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-2 px-4 space-y-2 shadow-lg">
          <Link href="/" className="block py-3 text-slate-600 font-medium border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>
            หน้าหลัก
          </Link>
          <Link href="/knowledge" className="block py-3 text-slate-600 font-medium border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>
            ความรู้ไซเบอร์
          </Link>

          {session ? (
            <>
              <Link href={dashboardLink} className="block py-3 text-blue-600 font-bold border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>
                {dashboardText}
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left py-3 text-red-500 font-medium">
                ออกจากระบบ
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
                <Link href="/login" className="block w-full py-3 text-center border border-slate-200 rounded-lg text-slate-600 font-bold" onClick={() => setIsMenuOpen(false)}>
                    เข้าสู่ระบบ
                </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}