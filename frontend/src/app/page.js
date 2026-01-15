'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Link as LinkIcon } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('url'); // 'url' หรือ 'qr'

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col relative overflow-hidden">
      
      {/* Navbar */}
      {/* px-4 สำหรับมือถือ, md:px-8 สำหรับจอใหญ่ */}
      <nav className="w-full flex justify-between items-center px-4 md:px-8 py-4 bg-white z-20">
        <div className="flex items-center gap-2">
           {/* Logo */}
           <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
             <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
           </div>
           <span className="text-lg md:text-xl font-bold text-slate-900">PhishWise</span>
        </div>
        
        {/* Menu (ซ่อนบนมือถือ hidden, แสดงบนจอใหญ่ md:flex) */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="text-slate-900 font-bold cursor-pointer">หน้าหลัก</a>
          <a href="#" className="hover:text-blue-600 transition cursor-pointer">H1</a>
          <a href="#" className="hover:text-blue-600 transition cursor-pointer">H2</a>
        </div>

        {/* Login Button */}
        <button className="px-4 py-2 md:px-6 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition shadow-md shadow-blue-200 whitespace-nowrap">
          Login
        </button>
      </nav>

      {/* Main Content */}
      {/* mt-20 มือถือ, mt-32 จอใหญ่ เพื่อความสมดุล */}
      <main className="flex-1 flex flex-col items-center justify-start pt-24 md:pt-32 px-4 md:px-0 z-10 w-full max-w-5xl mx-auto">
        
        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl mb-6 flex w-full max-w-[300px] md:max-w-fit shadow-inner">
          <button 
            onClick={() => setActiveTab('url')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition text-center ${activeTab === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            URL
          </button>
          <button 
            onClick={() => setActiveTab('qr')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-semibold transition text-center ${activeTab === 'qr' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            QR Code
          </button>
        </div>

        {/* Input Box Container */}
        {/* w-full เต็มจอมือถือ, max-w-3xl จำกัดความกว้างจอคอม */}
        <div className="w-full max-w-3xl relative group">
            {/* Background Layer (เงาและเส้นขอบ) */}
            <div className="absolute inset-0 bg-blue-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all bg-white">
                
                {/* Icon & Input */}
                <div className="flex-1 flex items-center w-full px-2">
                    <div className="text-slate-400 mr-3 shrink-0">
                        <LinkIcon size={20} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="กรอกลิงก์ URL ที่ต้องการตรวจสอบ..." 
                        className="flex-1 h-12 bg-transparent focus:outline-none text-slate-700 placeholder-slate-400 text-sm md:text-base w-full min-w-0"
                    />
                </div>

                {/* Scan Button */}
                {/* มือถือ: เต็มความกว้าง (w-full), จอใหญ่: ความกว้างอัตโนมัติ (md:w-auto) */}
                <Link href="/result" className="w-full md:w-auto">
                    <button className="w-full md:w-auto h-12 px-8 bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2">
                        SCAN
                    </button>
                </Link>
            </div>
        </div>

        {/* Helper Text (Optional) */}
        <p className="mt-6 text-slate-400 text-xs md:text-sm text-center px-8">
            รองรับการตรวจสอบทั้งเว็บไซต์ธนาคาร, อีคอมเมิร์ซ และโซเชียลมีเดีย
        </p>

      </main>
      
      {/* Background Decoration */}
      {/* Gradient สีม่วงจางๆ ด้านล่าง */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-purple-50/80 via-white to-transparent -z-10 pointer-events-none"></div>
    </div>
  );
}