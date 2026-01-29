'use client';
import { useState } from 'react';
import Link from 'next/link'; 
import { ShieldCheck, Globe, QrCode, Search, CheckCircle, ArrowRight } from 'lucide-react';

// ❌ ไม่ต้อง import Navbar แล้ว เพราะ Layout จัดการให้

export default function Home() {
  const [activeTab, setActiveTab] = useState('url');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 font-sans text-slate-800 flex flex-col">
    

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-4 border border-blue-100">
                    <ShieldCheck size={14} /> AI-Powered Security
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                    Analyze suspicious <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">URLs & QR Codes</span>
                </h1>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-2xl mx-auto">
                    ตรวจสอบลิงก์และสแกน QR Code เพื่อค้นหา Phishing และภัยคุกคามทางไซเบอร์ 
                    รู้ทันภัยไซเบอร์ได้เพียงวางลิงก์ที่น่าสงสัย
                </p>
            </div>

            {/* Input Card */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50/50">
                    <TabButton 
                        id="url" 
                        icon={<Globe size={18} />} 
                        label="ตรวจสอบ URL" 
                        active={activeTab} 
                        onClick={setActiveTab} 
                    />
                    <TabButton 
                        id="qr" 
                        icon={<QrCode size={18} />} 
                        label="สแกน QR Code" 
                        active={activeTab} 
                        onClick={setActiveTab} 
                    />
                </div>

                {/* Input Area */}
                <div className="p-6 md:p-8">
                    {activeTab === 'url' ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <Search size={20} />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="วางลิงก์ที่ต้องการตรวจสอบที่นี่ (เช่น https://example.com)" 
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-800"
                                />
                            </div>
                            <Link href="/result" className="block">
                                <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
                                    ตรวจสอบความปลอดภัย <ArrowRight size={20} />
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center py-8 space-y-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500">
                                <QrCode size={32} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-700">อัปโหลดภาพ QR Code</p>
                                <p className="text-sm text-slate-400">หรือลากไฟล์มาวางที่นี่</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Badge */}
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm font-semibold text-slate-500">
                <span className="flex items-center gap-2"><CheckCircle className="text-green-500" size={18} /> ไม่มีค่าใช้จ่าย</span>
                <span className="flex items-center gap-2"><CheckCircle className="text-green-500" size={18} /> รู้ผลทันที</span>
                <span className="flex items-center gap-2"><CheckCircle className="text-green-500" size={18} /> ปลอดภัย 100%</span>
            </div>

        </div>
      </main>

      {/* Footer Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/80 via-white to-white pointer-events-none"></div>
    </div>
  );
}

// Components
function TabButton({ id, icon, label, active, onClick }) {
    const isActive = active === id;
    return (
        <button 
            onClick={() => onClick(id)}
            className={`flex-1 py-4 flex flex-row items-center justify-center gap-2 transition-all duration-200 relative text-sm md:text-base
                ${isActive ? 'text-blue-600 bg-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 bg-slate-50/50'}
            `}
        >
            {icon}
            <span className={`font-bold ${isActive ? 'text-blue-600' : ''}`}>{label}</span>
            {isActive && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600"></div>}
        </button>
    );
}