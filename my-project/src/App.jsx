import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MemberDashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/Admin";
import KnowledgePage from "./pages/Knowledge";
import KnowledgeById from "./pages/KnowledgeById";
import ResultPage from "./pages/Result";
import ReportPage from "./pages/Report";
import HistoryPage from "./pages/History"; // ประวัติการแจ้งเบาะแส (อันเดิม)
import ScanHistory from "./pages/ScanHistory"; // 🔥 เพิ่ม: หน้าประวัติการสแกน (อันใหม่)
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const location = useLocation();
  
  // เช็คว่าถ้า path เริ่มต้นด้วย /admin ไม่ต้องแสดง Navbar
  const shouldShowNavbar = !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<MemberDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        <Route path="/result" element={<ResultPage />} />
        <Route path="/report" element={<ReportPage />} />
        
        {/* แยก Route ชัดเจน */}
        <Route path="/history" element={<HistoryPage />} /> {/* ประวัติแจ้งเบาะแส */}
        <Route path="/scan-history" element={<ScanHistory />} /> {/* 🔥 ประวัติสแกนลิงก์ */}
        
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/knowledge/:id" element={<KnowledgeById />} />
      </Routes>
    </div>
  );
}

export default App;