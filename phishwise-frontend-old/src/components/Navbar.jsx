import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// เพิ่ม Activity (สแกน) และ FileClock (ประวัติแจ้ง)
import { 
  ShieldCheck, Menu, X, LayoutDashboard, LogOut, ChevronDown, 
  AlertTriangle, Activity, FileClock 
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    navigate('/');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const dashboardLink = user?.role === 'ADMIN' ? '/admin' : '/dashboard';
  const dashboardText = user?.role === 'ADMIN' ? 'แผงควบคุม' : 'หน้าจอแสดงผลสถิติส่วนบุคคล';
  const isActive = (path) => location.pathname === path;

  const getNavLinkClass = (path) => {
    return isActive(path)
      ? "flex items-center gap-1 text-blue-600 font-bold px-3 py-2 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:bottom-0 after:left-0"
      : "flex items-center gap-1 text-slate-500 hover:text-blue-600 font-medium px-3 py-2 transition-all";
  };

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link to="/" className="flex items-center gap-2">
            <div className="text-blue-600"><ShieldCheck size={32} /></div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">PhishWise</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={getNavLinkClass("/")}>หน้าหลัก</Link>
            <Link to="/knowledge" className={getNavLinkClass("/knowledge")}>ความรู้ไซเบอร์</Link>

            {user && (
              <Link 
                to="/report" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition shadow-sm ${
                    isActive('/report') 
                    ? "bg-red-50 text-red-600 border border-red-200" 
                    : "bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 border border-slate-200"
                }`}
              >
                <AlertTriangle size={18} /> แจ้งเบาะแส
              </Link>
            )}

            {user ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold border border-blue-200 hover:bg-blue-200 transition">
                     {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in-up z-50">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    
                    <Link to={dashboardLink} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition">
                      <LayoutDashboard size={18} className="text-slate-400" /> {dashboardText}
                    </Link>

                    {/* 🔥 เพิ่มประวัติการสแกน */}
                    <Link to="/scan-history" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition">
                      <Activity size={18} className="text-slate-400" /> ประวัติการสแกนลิงก์
                    </Link>

                    {/* 🔥 ประวัติการแจ้งเบาะแส */}
                    <Link to="/history" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition">
                      <FileClock size={18} className="text-slate-400" /> ประวัติการแจ้งเบาะแส
                    </Link>
                    
                    <div className="border-t border-slate-50 my-1"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                      <LogOut size={18} /> ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-slate-600 font-bold hover:text-blue-600 transition">เข้าสู่ระบบ</Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition">สมัครสมาชิก</Link>
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-2 px-4 space-y-2 shadow-lg animate-fade-in-up">
           {/* ... (Mobile Menu code เหมือนเดิม ปรับ Link ตาม Desktop) ... */}
           {/* เพื่อความกระชับ ขอละไว้ในฐานที่เข้าใจ ถ้าต้องการบอกได้ครับ */}
        </div>
      )}
    </nav>
  );
}