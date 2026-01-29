import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ เปลี่ยนจาก next/link
import { useAuth } from "../context/AuthContext"; // ✅ เรียกใช้ Context ที่สร้างตะกี้
import { ShieldCheck, Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth(); // ดึงข้อมูล User และฟังก์ชัน Logout
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/'); // ออกแล้วกลับหน้าแรก
  };

  // ✅ สูตรคำนวณลิงก์ Dashboard (Admin ไป /admin, Member ไป /dashboard)
  const dashboardLink = user?.role === 'ADMIN' ? '/admin' : '/dashboard';
  const dashboardText = user?.role === 'ADMIN' ? 'Admin Panel' : 'Member Dashboard';

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-blue-600">
              <ShieldCheck size={32} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              PhishWise
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              หน้าหลัก
            </Link>
            <Link to="/knowledge" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              ความรู้ไซเบอร์
            </Link>

            {/* 🔥 Logic แสดงปุ่มตามสถานะ Login */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={dashboardLink}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-bold"
                >
                  <LayoutDashboard size={18} />
                  {dashboardText}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition font-medium"
                >
                  <LogOut size={18} /> ออกจากระบบ
                </button>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                   {user.name.charAt(0)}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2 text-slate-600 font-bold hover:text-blue-600 transition">
                  เข้าสู่ระบบ
                </Link>
                <Link to="/register" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                  สมัครสมาชิกฟรี
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
        <div className="md:hidden bg-white border-t border-slate-100 py-2 px-4 space-y-2 shadow-lg animate-fade-in-up">
          <Link to="/" className="block py-3 text-slate-600 font-medium border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>
            หน้าหลัก
          </Link>
          <Link to="/knowledge" className="block py-3 text-slate-600 font-medium border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>
            ความรู้ไซเบอร์
          </Link>

          {user ? (
            <>
              <Link to={dashboardLink} className="block py-3 text-blue-600 font-bold border-b border-slate-50" onClick={() => setIsMenuOpen(false)}>
                {dashboardText}
              </Link>
              <button onClick={handleLogout} className="w-full text-left py-3 text-red-500 font-medium">
                ออกจากระบบ
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
                <Link to="/login" className="block w-full py-3 text-center border border-slate-200 rounded-lg font-bold text-slate-600" onClick={() => setIsMenuOpen(false)}>
                    เข้าสู่ระบบ
                </Link>
                <Link to="/register" className="block w-full py-3 text-center bg-blue-600 text-white rounded-lg font-bold" onClick={() => setIsMenuOpen(false)}>
                    สมัครสมาชิก
                </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}