'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar'; // Import Navbar ที่ทำไว้
import { 
  Download, ShieldCheck, Globe, Calendar, CheckCircle2, 
  XCircle, AlertTriangle, BrainCircuit, ArrowLeft 
} from 'lucide-react';

export default function ResultPage() {
  // ไม่ต้องมี state menu แล้ว เพราะ Navbar จัดการเอง

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10 overflow-x-hidden">
      


      {/* Main Content (ส่วนแสดงผลเหมือนเดิมเป๊ะ) */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div className="w-full md:w-auto">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
                        วิเคราะห์สำเร็จ
                    </span>
                    <span className="text-slate-400 text-xs font-medium">ID: #PH-99283</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">ผลรายงานการวิเคราะห์</h1>
                <div className="flex items-center gap-2 text-slate-500 text-sm bg-white border border-slate-200 py-2 px-4 rounded-lg w-fit max-w-full shadow-sm">
                    <Globe size={18} className="text-blue-500 shrink-0" />
                    <a href="#" className="text-slate-700 hover:text-blue-600 hover:underline truncate font-medium font-mono">
                        https://example.com/login-secure...
                    </a>
                </div>
            </div>
            <button className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95">
                <Download size={18} /> Download Report
            </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"> 
            
            {/* Left Column: Gauge Chart */}
            <div className="lg:col-span-4 flex flex-col">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-between h-full min-h-[480px]">
                    <h3 className="text-slate-900 font-bold mb-6 text-lg w-full text-center border-b border-slate-100 pb-4">
                        คะแนนความปลอดภัย
                    </h3>
                    
                    <div className="relative w-64 h-64 flex items-center justify-center my-auto">
                        <div className="absolute w-full h-full rounded-full border-[16px] border-slate-100"></div>
                        <div className="absolute w-full h-full rounded-full" 
                            style={{ 
                                background: 'conic-gradient(#10B981 0% 85%, transparent 85% 100%)',
                                maskImage: 'radial-gradient(transparent 56%, black 60%)',
                                WebkitMaskImage: 'radial-gradient(transparent 56%, black 60%)'
                            }}>
                        </div>
                        <div className="flex flex-col items-center z-10 relative top-1">
                            <span className="text-7xl font-black text-slate-900 tracking-tighter drop-shadow-sm">85%</span>
                            <span className="text-green-600 font-bold text-xl mt-[-5px]">ปลอดภัย</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full mt-8">
                        <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100">
                            <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Confidence</p>
                            <p className="text-base font-bold text-slate-900">สูง (High)</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                            <p className="text-[10px] text-slate-500 mb-1 font-bold uppercase">Scan Time</p>
                            <p className="text-base font-bold text-slate-900">0.45s</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:col-span-8 flex flex-col gap-6 h-full">
                
                {/* 3 Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoCard 
                        icon={<ShieldCheck size={24} />} 
                        iconColor="text-blue-600 bg-blue-50"
                        badge="ใบรับรอง SSL" 
                        badgeColor="bg-green-100 text-green-700 border border-green-200"
                        label="Issuer"
                        value="DigiCert Inc."
                        sub="หมดอายุ: 12 ต.ค. 2025"
                    />
                    <InfoCard 
                        icon={<Calendar size={24} />} 
                        iconColor="text-purple-600 bg-purple-50"
                        badge="อายุโดเมน"
                        badgeColor="bg-green-100 text-green-700 border border-green-200"
                        label="Created Date"
                        value="2 ปี 4 เดือน"
                        sub="จดทะเบียน: 2021"
                    />
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center h-full hover:border-green-300 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-orange-50 rounded-xl text-orange-500">
                                <BrainCircuit size={24} />
                            </div>
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 border border-green-200 text-xs md:text-sm font-bold rounded-lg shadow-sm whitespace-nowrap">
                                ค่าความเสี่ยงของ URL
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-1 font-medium">AI Analysis Score</p>
                        <p className="font-bold text-slate-900 text-2xl">15<span className="text-sm text-slate-400 font-normal">/100</span></p>
                        <div className="w-full h-2 bg-slate-100 mt-3 rounded-full overflow-hidden">
                            <div className="w-[15%] h-full bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Deep Analysis Table */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                        <h3 className="text-lg font-bold text-slate-900">ผลการวิเคราะห์เชิงลึก (Deep Analysis)</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <AnalysisItem 
                            icon={<XCircle className="text-red-500" size={22} />}
                            title="ฐานข้อมูลบัญชีดำ (Blacklist)"
                            desc="พบประวัติเคยถูกรายงานในระบบ"
                            status="พบความเสี่ยง"
                            statusColor="bg-red-100 text-red-700 border border-red-200"
                        />
                         <AnalysisItem 
                            icon={<CheckCircle2 className="text-green-500" size={22} />}
                            title="Google Safe Browsing"
                            desc="ไม่พบรายชื่อในฐานข้อมูล Google"
                            status="ปลอดภัย"
                            statusColor="bg-green-100 text-green-700 border border-green-200"
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
                            desc="United States (AWS Data Center)"
                            status="สอดคล้อง"
                            statusColor="bg-green-100 text-green-700 border border-green-200"
                        />
                         <div className="md:col-span-2 pt-2 border-t border-dashed border-slate-100 mt-2">
                             <AnalysisItem 
                                icon={<AlertTriangle className="text-orange-500" size={22} />}
                                title="การส่งต่อลิงก์ (Redirection)"
                                desc="มีการ Redirect ไปยังภายนอก (suspicious-site.com)"
                                status="น่าสงสัย"
                                statusColor="bg-orange-100 text-orange-700 border border-orange-200"
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

// Components (ใส่ไว้ท้ายไฟล์เหมือนเดิม)
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
            <p className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{value}</p>
            <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
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