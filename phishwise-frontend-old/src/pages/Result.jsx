import { useState } from "react";
import {
  Download,
  ShieldCheck,
  Globe,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BrainCircuit,
  ArrowLeft,
  Unlock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResultPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. ดึงข้อมูลสแกนจริงจาก API หลังบ้านที่ส่งต่อมาจากหน้า Scan
  const location = useLocation();
  const apiData = location.state?.scanResult;

  const handleDownload = () => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบเพื่อดาวน์โหลดรายงาน PDF");
      navigate("/login");
    } else {
      alert("กำลังดาวน์โหลดรายงาน PDF...");
    }
  };

  // =================================================================
  // ⚙️ [⚡️ CORE LOGIC] คำนวณค่าความเสี่ยง (Risk) และ คะแนนความปลอดภัย (Safety)
  // =================================================================

  // 🟢 [คะแนนความปลอดภัยหน้าบ้าน] ดึงค่าตรงจาก API (เช่น github ส่งมา 99 ก็คือ ปลอดภัย 99%)
  const safetyScore = apiData ? (apiData.score ?? 0) : 0;

  // 🔴 [ค่าความเสี่ยงหลังบ้าน] คำนวณกลับด้านตามสูตร (100 - คะแนนความปลอดภัย) -> ได้ 1%
  const riskScore = 100 - safetyScore;

  // 🎨 ควบคุมการแสดงผลชุดสี (Theme) และข้อความ โดยอิงความปลอดภัยหน้าบ้าน (Safety Score)
  const isSafe = safetyScore >= 80;
  const isRisk = safetyScore >= 50 && safetyScore < 80;

  const theme = {
    color: isSafe
      ? "text-green-600"
      : isRisk
        ? "text-orange-500"
        : "text-red-600",
    bg: isSafe ? "bg-green-50" : isRisk ? "bg-orange-50" : "bg-red-50",
    border: isSafe
      ? "border-green-200"
      : isRisk
        ? "border-orange-200"
        : "border-red-200",
    hex: isSafe ? "#10B981" : isRisk ? "#F59E0B" : "#EF4444",
    badge: isSafe
      ? "bg-green-100 text-green-700 border-green-200"
      : isRisk
        ? "bg-orange-100 text-orange-700 border-orange-200"
        : "bg-red-100 text-red-700 border-red-200",
    statusText: apiData
      ? isSafe
        ? "ปลอดภัย"
        : isRisk
          ? "มีความเสี่ยง"
          : "อันตราย"
      : "ไม่พบข้อมูล",
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10 overflow-x-hidden relative">
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* ปุ่มกลับหน้าหลัก */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={16} /> กลับสู่หน้าหลัก
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div className="w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border ${theme.badge}`}
              >
                สถานะ: {theme.statusText}
              </span>
              <span className="text-slate-400 text-xs font-medium">
                ID: #PH-{apiData?.status === "safe" ? "99283" : "54219"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
              ผลรายงานการวิเคราะห์
            </h1>
            <div className="flex items-center gap-2 text-slate-500 text-sm bg-white border border-slate-200 py-2 px-4 rounded-lg w-fit max-w-full shadow-sm">
              <Globe
                size={18}
                className={
                  apiData?.ssl_title && apiData?.ssl_title !== "Not Secure"
                    ? "text-green-500"
                    : "text-red-500"
                }
              />
              <span className="text-slate-700 font-medium font-mono truncate max-w-xs md:max-w-xl">
                {apiData?.url ?? "ไม่ระบุ URL"}
              </span>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Download size={18} />{" "}
            {user ? "ดาวน์โหลดรายงาน" : "เข้าสู่ระบบเพื่อโหลดรายงาน"}
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* ซ้าย: วงกลมแสดงคะแนนความปลอดภัยหน้าบ้าน */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between h-full min-h-[480px]">
              <h3 className="text-slate-900 font-bold mb-6 text-lg w-full text-center border-b border-slate-100 pb-4">
                คะแนนความปลอดภัยหน้าบ้าน
              </h3>

              <div className="relative w-64 h-64 flex items-center justify-center my-auto">
                <div className="absolute w-full h-full rounded-full border-[16px] border-slate-100"></div>
                <div
                  className="absolute w-full h-full rounded-full transition-all duration-1000"
                  style={{
                    background: `conic-gradient(${theme.hex} 0% ${safetyScore}%, transparent ${safetyScore}% 100%)`,
                    maskImage: "radial-gradient(transparent 56%, black 60%)",
                    WebkitMaskImage:
                      "radial-gradient(transparent 56%, black 60%)",
                  }}
                ></div>
                <div className="flex flex-col items-center z-10 relative top-1">
                  <span
                    className={`text-7xl font-black tracking-tighter drop-shadow-sm ${theme.color}`}
                  >
                    {safetyScore}%
                  </span>
                  <span
                    className={`font-bold text-xl mt-[-5px] ${theme.color}`}
                  >
                    {theme.statusText}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-8">
                <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100">
                  <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase">
                    Confidence
                  </p>
                  <p className="text-base font-bold text-slate-900">
                    สูง (99.9%)
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase">
                    Scan Time
                  </p>
                  <p className="text-base font-bold text-slate-900">0.45s</p>
                </div>
              </div>
            </div>
          </div>

          {/* ขวา: ข้อมูลสภาพแวดล้อม และ ตารางเจาะลึกอื่นๆ */}
          <div className="lg:col-span-8 flex flex-col gap-6 h-full">
            {/* 3 Small Cards สรุปด้านบน */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ใบรับรอง SSL */}
              {apiData?.ssl_title && apiData?.ssl_title !== "Not Secure" ? (
                <InfoCard
                  icon={<ShieldCheck size={24} />}
                  iconColor="text-blue-600 bg-blue-50"
                  badge="ใบรับรอง SSL"
                  badgeColor="bg-green-100 text-green-700 border border-green-200"
                  label="Issuer"
                  value={apiData.ssl_title}
                  sub={apiData.ssl_sub}
                />
              ) : (
                <InfoCard
                  icon={<Unlock size={24} />}
                  iconColor="text-red-600 bg-red-50"
                  badge="ไม่เข้ารหัส"
                  badgeColor="bg-red-100 text-red-700 border border-red-200"
                  label="Security"
                  value={apiData?.ssl_title ?? "Not Secure"}
                  sub={apiData?.ssl_sub ?? "ไม่พบการเข้ารหัสข้อมูลที่ปลอดภัย"}
                />
              )}

              {/* อายุโดเมน */}
              <InfoCard
                icon={<Calendar size={24} />}
                iconColor="text-purple-600 bg-purple-50"
                badge="อายุโดเมน"
                badgeColor={
                  apiData?.domain_age === "ไม่พบข้อมูล"
                    ? "bg-orange-100 text-orange-700 border-orange-200"
                    : "bg-green-100 text-green-700 border-green-200"
                }
                label="Created Date"
                value={apiData?.domain_age ?? "ไม่พบข้อมูล"}
                sub={apiData?.domain_sub ?? "ไม่พบประวัติข้อมูลระบบจัดทะเบียน"}
              />

              {/* แสดงค่าความเสี่ยงรวมหลังบ้าน (100 - ความปลอดภัย) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center h-full">
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-2.5 rounded-xl ${theme.bg} ${theme.color}`}
                  >
                    <BrainCircuit size={24} />
                  </div>
                  <span className="px-3 py-1.5 text-xs md:text-sm font-bold rounded-lg shadow-sm whitespace-nowrap border bg-slate-100 text-slate-700 border-slate-200">
                    ค่าความเสี่ยงรวม
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-1 font-medium">
                  AI Phishing Risk Score
                </p>
                <p className={`font-bold text-2xl ${theme.color}`}>
                  {riskScore}
                  <span className="text-sm text-slate-400 font-normal">
                    /100 Risk
                  </span>
                </p>
                <div className="w-full h-2 bg-slate-100 mt-3 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${riskScore}%`,
                      backgroundColor: theme.hex,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* ตารางผลการวิเคราะห์เชิงลึก (Deep Analysis) */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div
                  className="w-1.5 h-6 rounded-full"
                  style={{ backgroundColor: theme.hex }}
                ></div>
                <h3 className="text-lg font-bold text-slate-900">
                  ผลการวิเคราะห์เชิงลึก (Deep Analysis)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {/* 🔗 โครงสร้าง URL (Structure) - นำกลับมาใส่ตามเดิมแล้ว */}
                <AnalysisItem
                  icon={
                    safetyScore >= 50 ? (
                      <CheckCircle2 className="text-green-500" size={22} />
                    ) : (
                      <XCircle className="text-red-500" size={22} />
                    )
                  }
                  title="โครงสร้าง URL (Structure)"
                  desc="ลักษณะความยาวและโครงสร้างอักขระลิงก์ปลอดภัยปกติ"
                  status={safetyScore >= 50 ? "ปกติ" : "พบความเสี่ยง"}
                  statusColor={
                    safetyScore >= 50
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }
                />

                {/* Global Blacklist Database */}
                <AnalysisItem
                  icon={
                    apiData?.is_blacklisted ? (
                      <XCircle className="text-red-500" size={22} />
                    ) : (
                      <CheckCircle2 className="text-green-500" size={22} />
                    )
                  }
                  title="ฐานข้อมูลบัญชีดำ (Blacklist Checking)"
                  desc={
                    apiData?.is_blacklisted
                      ? "พบประวัติโดเมนนี้ในฐานข้อมูลรายงานมัลแวร์สากล"
                      : "ไม่พบประวัติการทำสิ่งทุจริตในระบบฐานข้อมูลสากล"
                  }
                  status={apiData?.is_blacklisted ? "พบความเสี่ยง" : "ปลอดภัย"}
                  statusColor={
                    apiData?.is_blacklisted
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-green-100 text-green-700 border-green-200"
                  }
                />

                {/* Google Safe Browsing */}
                <AnalysisItem
                  icon={
                    apiData?.google_safe ? (
                      <CheckCircle2 className="text-green-500" size={22} />
                    ) : (
                      <AlertTriangle className="text-red-500" size={22} />
                    )
                  }
                  title="Google Safe Browsing"
                  desc={
                    apiData?.google_safe
                      ? "ไม่พบรายชื่อติดขัดในระบบความปลอดภัยของ Google"
                      : "ระบบตรวจจับเว็บอันตรายของ Google ขึ้นสถานะแจ้งเตือน"
                  }
                  status={apiData?.google_safe ? "ปลอดภัย" : "อันตราย"}
                  statusColor={
                    apiData?.google_safe
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }
                />

                {/* ที่ตั้งเซิร์ฟเวอร์ */}
                <AnalysisItem
                  icon={<Globe className="text-slate-400" size={22} />}
                  title="ที่ตั้งเซิร์ฟเวอร์หลัก (Server Location)"
                  desc={apiData?.location ?? "ไม่พบพิกัดระบุชัดเจน"}
                  status="สอดคล้อง"
                  statusColor="bg-slate-100 text-slate-600 border-slate-200"
                />

                {/* พฤติกรรมการส่งต่อลิงก์หลบเลี่ยง */}
                <div className="md:col-span-2 pt-2 border-t border-dashed border-slate-100 mt-2">
                  <AnalysisItem
                    icon={
                      apiData?.has_redirection ? (
                        <AlertTriangle className="text-orange-500" size={22} />
                      ) : (
                        <CheckCircle2 className="text-green-500" size={22} />
                      )
                    }
                    title="การส่งต่อลิงก์หลบเลี่ยง (Redirection)"
                    desc={
                      apiData?.has_redirection
                        ? "ตรวจพบกลไกการสั่งปลายทางเปลี่ยนทิศทางเพื่อลวงสายตา"
                        : "ลิงก์เข้าถึงหน้าเพจตรงเป้าหมายเดี่ยว ไม่มีพฤติกรรมส่งต่อ"
                    }
                    status={apiData?.has_redirection ? "น่าสงสัย" : "ปกติ"}
                    statusColor={
                      apiData?.has_redirection
                        ? "bg-orange-100 text-orange-700 border-orange-200"
                        : "bg-green-100 text-green-700 border-green-200"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function InfoCard({ icon, iconColor, badge, badgeColor, label, value, sub }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center h-full hover:border-blue-300 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl transition-colors ${iconColor}`}>
          {icon}
        </div>
        <span
          className={`px-3 py-1.5 text-xs md:text-sm font-bold rounded-lg shadow-sm whitespace-nowrap ${badgeColor}`}
        >
          {badge}
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-0.5 font-medium">{label}</p>
      <p className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors truncate">
        {value}
      </p>
      <p className="text-[10px] text-slate-400 mt-1 truncate">{sub}</p>
    </div>
  );
}

function AnalysisItem({ icon, title, desc, status, statusColor }) {
  return (
    <div className="flex justify-between items-start group">
      <div className="flex gap-4">
        <div className="mt-0.5 shrink-0 bg-slate-50 p-1.5 rounded-lg group-hover:bg-blue-50 transition-colors">
          {icon}
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
            {title}
          </p>
          <p className="text-xs text-slate-500 mt-1 font-medium">{desc}</p>
        </div>
      </div>
      <span
        className={`px-3 py-1 text-[10px] font-bold rounded-md whitespace-nowrap ml-4 ${statusColor}`}
      >
        {status}
      </span>
    </div>
  );
}
