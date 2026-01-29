import { useState } from 'react';
// import Navbar from '../components/Navbar'; // ⚠️ เปิดบรรทัดนี้เมื่อมีไฟล์ Navbar จริง (ตรวจสอบ path ให้ถูกต้อง)
import { 
  Download, ShieldCheck, Globe, Calendar, CheckCircle2, 
  XCircle, AlertTriangle, BrainCircuit, ArrowLeft, Unlock 
} from 'lucide-react';

export default function ResultPage() {

  // =================================================================
  // 1. DATA: ข้อมูลจำลอง (Mock Data)
  // =================================================================
  const SCENARIOS = {
    safe: {
      score: 98,
      statusText: "ปลอดภัย",
      url: "https://www.google.com",
      
      hasSSL: true,
      sslTitle: "DigiCert Inc.",
      sslSub: "หมดอายุ: 12 ต.ค. 2026",

      domainAge: "2 ปี 4 เดือน",
      domainSub: "จดทะเบียน: 12 มิ.ย. 2024",

      isBlacklisted: false,
      googleSafe: true,
      hasRedirection: false,
      location: "United States (Google LLC)"
    },
    risk: {
      score: 65,
      statusText: "มีความเสี่ยง",
      url: "http://free-bonus-promo.net",
      
      hasSSL: true,
      sslTitle: "Let's Encrypt",
      sslSub: "หมดอายุ: 12 ธ.ค. 2026",
      
      domainAge: "3 เดือน",
      domainSub: "12 พ.ย. 2025",

      isBlacklisted: false,
      googleSafe: true,
      hasRedirection: true,
      location: "Russia"
    },
    danger: {
      score: 15,
      statusText: "อันตราย",
      url: "http://kbank-verify-login.xyz",
      
      hasSSL: false,
      sslTitle: "Not Secure",
      sslSub: "หมดอายุ: 12 ต.ค. 2020",
      
      domainAge: "2 วัน",
      domainSub: "จดทะเบียน: 29 ม.ค. 2026",

      isBlacklisted: true,
      googleSafe: false,
      hasRedirection: false,
      location: "Unknown Proxy"
    }
  };

  // State เก็บสถานะปัจจุบัน (Default = Safe)
  const [currentScenario, setCurrentScenario] = useState('safe');
  const result = SCENARIOS[currentScenario];

  // =================================================================
  // 2. THEME LOGIC
  // =================================================================
  const isSafe = result.score >= 80;
  const isRisk = result.score >= 50 && result.score < 80;

  const theme = {
    color: isSafe ? "text-green-600" : (isRisk ? "text-orange-500" : "text-red-600"),
    bg: isSafe ? "bg-green-50" : (isRisk ? "bg-orange-50" : "bg-red-50"),
    border: isSafe ? "border-green-200" : (isRisk ? "border-orange-200" : "border-red-200"),
    hex: isSafe ? "#10B981" : (isRisk ? "#F59E0B" : "#EF4444"),
    badge: isSafe ? "bg-green-100 text-green-700 border-green-200" : (isRisk ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-red-100 text-red-700 border-red-200")
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10 overflow-x-hidden relative">
      
      {/* <Navbar />  <-- เปิดใช้งานถ้ามี Component นี้ */}

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div className="w-full md:w-auto">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${theme.badge}`}>
                        สถานะ: {result.statusText}
                    </span>
                    <span className="text-slate-400 text-xs font-medium">ID: #PH-99283</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">ผลรายงานการวิเคราะห์</h1>
                <div className="flex items-center gap-2 text-slate-500 text-sm bg-white border border-slate-200 py-2 px-4 rounded-lg w-fit max-w-full shadow-sm">
                    <Globe size={18} className={result.hasSSL ? "text-green-500" : "text-red-500"} />
                    {/* เปลี่ยน Link เป็น a tag ธรรมดาสำหรับ React/Vite */}
                    <a href="#" className="text-slate-700 hover:text-blue-600 hover:underline truncate font-medium font-mono">
                        {result.url}
                    </a>
                </div>
            </div>
            <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
                <Download size={18} /> Download Report
            </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"> 
            
            {/* Left: Gauge Chart */}
            <div className="lg:col-span-4 flex flex-col">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between h-full min-h-[480px]">
                    <h3 className="text-slate-900 font-bold mb-6 text-lg w-full text-center border-b border-slate-100 pb-4">
                        คะแนนความปลอดภัย
                    </h3>
                    
                    <div className="relative w-64 h-64 flex items-center justify-center my-auto">
                        <div className="absolute w-full h-full rounded-full border-[16px] border-slate-100"></div>
                        <div className="absolute w-full h-full rounded-full transition-all duration-1000" 
                            style={{ 
                                background: `conic-gradient(${theme.hex} 0% ${result.score}%, transparent ${result.score}% 100%)`,
                                maskImage: 'radial-gradient(transparent 56%, black 60%)',
                                WebkitMaskImage: 'radial-gradient(transparent 56%, black 60%)'
                            }}>
                        </div>
                        <div className="flex flex-col items-center z-10 relative top-1">
                            <span className={`text-7xl font-black tracking-tighter drop-shadow-sm ${theme.color}`}>
                                {result.score}%
                            </span>
                            <span className={`font-bold text-xl mt-[-5px] ${theme.color}`}>
                                {result.statusText}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full mt-8">
                        <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100">
                            <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Confidence</p>
                            <p className="text-base font-bold text-slate-900">สูง (99.9%)</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                            <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Scan Time</p>
                            <p className="text-base font-bold text-slate-900">0.45s</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-8 flex flex-col gap-6 h-full">
                
                {/* 3 Small Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.hasSSL ? (
                        <InfoCard 
                            icon={<ShieldCheck size={24} />} 
                            iconColor="text-blue-600 bg-blue-50"
                            badge="ใบรับรอง SSL" 
                            badgeColor="bg-green-100 text-green-700 border border-green-200"
                            label="Issuer"
                            value={result.sslTitle} 
                            sub={result.sslSub}     
                        />
                    ) : (
                        <InfoCard 
                            icon={<Unlock size={24} />} 
                            iconColor="text-red-600 bg-red-50"
                            badge="ไม่เข้ารหัส" 
                            badgeColor="bg-red-100 text-red-700 border border-red-200"
                            label="Security"
                            value={result.sslTitle}
                            sub={result.sslSub}
                        />
                    )}

                    <InfoCard 
                        icon={<Calendar size={24} />} 
                        iconColor="text-purple-600 bg-purple-50"
                        badge="อายุโดเมน"
                        badgeColor={result.domainAge === "2 วัน" || result.domainAge === "3 เดือน" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-green-100 text-green-700 border-green-200"}
                        label="Created Date"
                        value={result.domainAge} 
                        sub={result.domainSub}   
                    />

                    <div className={`bg-white p-5 rounded-2xl border ${theme.border} shadow-sm flex flex-col justify-center h-full`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.color}`}>
                                <BrainCircuit size={24} />
                            </div>
                            <span className={`px-3 py-1.5 text-xs md:text-sm font-bold rounded-lg shadow-sm whitespace-nowrap border ${theme.badge}`}>
                                ค่าความเสี่ยง URL
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-1 font-medium">AI Analysis Score</p>
                        <p className={`font-bold text-2xl ${theme.color}`}>
                            {result.score}<span className="text-sm text-slate-400 font-normal">/100</span>
                        </p>
                        <div className="w-full h-2 bg-slate-100 mt-3 rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${result.score}%`, backgroundColor: theme.hex }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Deep Analysis Table */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: theme.hex }}></div>
                        <h3 className="text-lg font-bold text-slate-900">ผลการวิเคราะห์เชิงลึก (Deep Analysis)</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <AnalysisItem 
                            icon={result.isBlacklisted ? <XCircle className="text-red-500" size={22} /> : <CheckCircle2 className="text-green-500" size={22} />}
                            title="ฐานข้อมูลบัญชีดำ (Blacklist)"
                            desc={result.isBlacklisted ? "พบประวัติใน Blacklist!" : "ไม่พบประวัติในระบบ"}
                            status={result.isBlacklisted ? "พบความเสี่ยง" : "ปลอดภัย"}
                            statusColor={result.isBlacklisted ? "bg-red-100 text-red-700 border border-red-200" : "bg-green-100 text-green-700 border border-green-200"}
                        />
                        
                         <AnalysisItem 
                            icon={result.googleSafe ? <CheckCircle2 className="text-green-500" size={22} /> : <AlertTriangle className="text-red-500" size={22} />}
                            title="Google Safe Browsing"
                            desc={result.googleSafe ? "ไม่พบรายชื่อในฐานข้อมูล Google" : "Google เตือนอันตราย"}
                            status={result.googleSafe ? "ปลอดภัย" : "อันตราย"}
                            statusColor={result.googleSafe ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border-red-200"}
                        />
                        
                        <AnalysisItem 
                            icon={<CheckCircle2 className="text-green-500" size={22} />}
                            title="โครงสร้าง URL (Structure)"
                            desc="รูปแบบลิงก์ปกติ ไม่มีการ obfuscate"
                            status="ปกติ"
                            statusColor="bg-green-100 text-green-700 border border-green-200"
                        />
                        
                        <AnalysisItem 
                            icon={<Globe className="text-slate-400" size={22} />}
                            title="ที่ตั้งเซิร์ฟเวอร์ (Location)"
                            desc={result.location}
                            status="สอดคล้อง"
                            statusColor="bg-slate-100 text-slate-600 border border-slate-200"
                        />

                         <div className="md:col-span-2 pt-2 border-t border-dashed border-slate-100 mt-2">
                             <AnalysisItem 
                                icon={result.hasRedirection ? <AlertTriangle className="text-orange-500" size={22} /> : <CheckCircle2 className="text-green-500" size={22} />}
                                title="การส่งต่อลิงก์ (Redirection)"
                                desc={result.hasRedirection ? "มีการ Redirect น่าสงสัย" : "ไม่มีการส่งต่อลิงก์"}
                                status={result.hasRedirection ? "น่าสงสัย" : "ปกติ"}
                                statusColor={result.hasRedirection ? "bg-orange-100 text-orange-700 border border-orange-200" : "bg-green-100 text-green-700 border border-green-200"}
                            />
                         </div>
                    </div>
                </div>

            </div>
        </div>
      </main>

      {/* Demo Controller */}
      <div className="fixed bottom-6 right-6 z-50 bg-white p-3 rounded-2xl shadow-2xl border border-slate-200 flex flex-col gap-2 animate-bounce-in">
         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1">Demo Mode</div>
         <div className="flex gap-2">
            <button 
                onClick={() => setCurrentScenario('safe')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentScenario === 'safe' ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
                Safe
            </button>
            <button 
                onClick={() => setCurrentScenario('risk')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentScenario === 'risk' ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
                Risk
            </button>
            <button 
                onClick={() => setCurrentScenario('danger')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentScenario === 'danger' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
                Danger
            </button>
         </div>
      </div>

    </div>
  );
}

// Components Helper
function InfoCard({ icon, iconColor, badge, badgeColor, label, value, sub }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center h-full hover:border-blue-300 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl transition-colors ${iconColor}`}>{icon}</div>
                <span className={`px-3 py-1.5 text-xs md:text-sm font-bold rounded-lg shadow-sm whitespace-nowrap ${badgeColor}`}>
                    {badge}
                </span>
            </div>
            <p className="text-xs text-slate-400 mb-0.5 font-medium">{label}</p>
            <p className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors truncate">{value}</p>
            <p className="text-[10px] text-slate-400 mt-1 truncate">{sub}</p>
        </div>
    );
}

function AnalysisItem({ icon, title, desc, status, statusColor }) {
    return (
        <div className="flex justify-between items-start group">
            <div className="flex gap-4">
                <div className="mt-0.5 shrink-0 bg-slate-50 p-1.5 rounded-lg group-hover:bg-blue-50 transition-colors">{icon}</div>
                <div>
                    <p className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">{title}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{desc}</p>
                </div>
            </div>
            <span className={`px-3 py-1 text-[10px] font-bold rounded-md whitespace-nowrap ml-4 ${statusColor}`}>
                {status}
            </span>
        </div>
    )
}