'use client';
import Link from 'next/link';
import { Download, ShieldCheck, Globe, Calendar, CheckCircle2, XCircle, AlertTriangle, User, BrainCircuit, Menu } from 'lucide-react';

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-10 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 md:px-8 py-3 bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
             <ShieldCheck size={20} />
           </div>
           <span className="text-lg font-bold text-slate-900">PhishWise</span>
        </Link>
        
        <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition">หน้าหลัก</Link>
          <a href="#" className="hover:text-blue-600 transition">ประวัติ</a>
          <a href="#" className="hover:text-blue-600 transition">ตั้งค่า</a>
        </div>

        <div className="flex items-center gap-3">
            <button className="hidden md:block px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition">
                Log Out
            </button>
            <div className="w-8 h-8 rounded-full border border-orange-300 p-0.5 shrink-0">
                <div className="w-full h-full bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                    <User size={16} />
                </div>
            </div>
            <button className="md:hidden text-slate-500 ml-1">
                <Menu size={24} />
            </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div className="w-full md:w-auto">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">การวิเคราะห์สำเร็จ</span>
                    <span className="text-slate-400 text-xs font-medium">ID: #PH-99283</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">ผลรายงานการวิเคราะห์</h1>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <LinkIconSize16 />
                    <a href="#" className="text-blue-600 underline decoration-blue-300 underline-offset-4 hover:text-blue-700 truncate max-w-[200px] md:max-w-md">
                        https://example.com/login-secure...
                    </a>
                </div>
            </div>
            <button className="w-full md:w-auto px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-700/20 active:scale-95">
                <Download size={16} /> Download Report
            </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"> 
            
            {/* Left Column: Score Gauge */}
            <div className="lg:col-span-4 flex flex-col">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-between h-full min-h-[450px]">
                    <h3 className="text-slate-900 font-bold mb-4 text-lg">คะแนนความปลอดภัย</h3>
                    
                    {/* Gauge Chart */}
                    <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center my-auto">
                        <div className="absolute w-full h-full rounded-full bg-slate-100"></div>
                        <div className="absolute w-full h-full rounded-full" 
                            style={{ 
                                background: 'conic-gradient(#10B981 0% 85%, #cbd5e1 85% 100%)', 
                                maskImage: 'radial-gradient(transparent 60%, black 61%)',
                                WebkitMaskImage: 'radial-gradient(transparent 60%, black 61%)'
                            }}>
                        </div>
                        <div className="flex flex-col items-center z-10 mt-2">
                            <span className="text-7xl font-black text-slate-900 tracking-tighter drop-shadow-sm">85%</span>
                            <span className="text-green-600 font-bold text-xl mt-1">ปลอดภัย</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full mt-auto pt-6">
                        <div className="bg-purple-50 p-3 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 mb-1 font-medium">ระดับความเชื่อมั่น</p>
                            <p className="text-sm font-bold text-slate-900">สูง (High)</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 mb-1 font-medium">ตรวจสอบเมื่อ</p>
                            <p className="text-sm font-bold text-slate-900">เมื่อสักครู่</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-8 flex flex-col gap-4 h-full">
                
                {/* 3 Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <InfoCard 
                        icon={<ShieldCheck size={20} />} 
                        iconColor="text-blue-600 bg-blue-50"
                        badge="มีใบรับรอง"
                        badgeColor="bg-green-100 text-green-700"
                        label="SSL Certificate"
                        value="DigiCert Inc."
                        sub="หมดอายุอีก 214 วัน"
                    />
                    <InfoCard 
                        icon={<Calendar size={20} />} 
                        iconColor="text-purple-600 bg-purple-50"
                        badge="จดทะเบียนเมื่อ"
                        badgeColor="bg-green-100 text-green-700"
                        label="อายุโดเมน"
                        value="2 ปี 4 เดือน"
                        sub="สร้างเมื่อ 8 ส.ค. 2024"
                    />
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><BrainCircuit size={20} /></div>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full">ความเสี่ยงต่ำ</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-0.5 font-medium">URL Entropy Score</p>
                        <p className="font-bold text-slate-900 text-base">15%</p>
                        <div className="w-full h-1 bg-slate-100 mt-2 rounded-full overflow-hidden">
                            <div className="w-[15%] h-full bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Deep Analysis Table */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1 h-5 bg-blue-700 rounded-full"></div>
                        <h3 className="text-base font-bold text-slate-900">ผลการวิเคราะห์เชิงลึก</h3>
                    </div>
                    
                    {/* Items Grid: ตัดส่วนแยกออก รวมเป็น Grid เดียวกันทั้งหมด */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 h-full content-between">
                        <AnalysisItem 
                            icon={<XCircle className="text-red-500" size={20} />}
                            title="ฐานข้อมูลบัญชีดำในระบบ"
                            desc="พบประวัติในระบบ"
                            status="พบความเสี่ยง"
                            statusColor="bg-red-100 text-red-600"
                        />
                         <AnalysisItem 
                            icon={<CheckCircle2 className="text-green-500" size={20} />}
                            title="ฐานข้อมูลบัญชีดำนอกระบบ"
                            desc="Google Safe Browsing"
                            status="ไม่พบ"
                            statusColor="bg-green-100 text-green-600"
                        />
                        <AnalysisItem 
                            icon={<CheckCircle2 className="text-green-500" size={20} />}
                            title="รูปแบบ URL"
                            desc="โครงสร้างลิงก์ปกติ"
                            status="ปกติ"
                            statusColor="bg-green-100 text-green-600"
                        />
                        <AnalysisItem 
                            icon={<Globe className="text-slate-400" size={20} />}
                            title="ที่ตั้งเซิร์ฟเวอร์"
                            desc="United States (AWS)"
                            status="สอดคล้อง"
                            statusColor="bg-green-100 text-green-600"
                        />
                         <AnalysisItem 
                            icon={<AlertTriangle className="text-yellow-500" size={20} />}
                            title="การส่งต่อลิงก์ (Redirection)"
                            desc="Redirect ไปยังภายนอกที่น่าสงสัย"
                            status="น่าสงสัย"
                            statusColor="bg-yellow-100 text-yellow-700"
                        />
                    </div>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}

// ---- Components ----

function InfoCard({ icon, iconColor, badge, badgeColor, label, value, sub }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${iconColor}`}>{icon}</div>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${badgeColor}`}>{badge}</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-0.5 font-medium">{label}</p>
            <p className="font-bold text-slate-900 text-base">{value}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
        </div>
    );
}

function AnalysisItem({ icon, title, desc, status, statusColor }) {
    return (
        <div className="flex justify-between items-start group py-1">
            <div className="flex gap-4">
                <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">{icon}</div>
                <div>
                    <p className="font-bold text-slate-900 text-sm">{title}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{desc}</p>
                </div>
            </div>
            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md whitespace-nowrap ml-4 ${statusColor}`}>
                {status}
            </span>
        </div>
    )
}

function LinkIconSize16() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
    )
}