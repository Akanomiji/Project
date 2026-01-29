import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Globe, QrCode, Search, CheckCircle, ArrowRight, Upload, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('url');
  const [fileName, setFileName] = useState(''); // เก็บชื่อไฟล์ที่อัปโหลด

  // ฟังก์ชันจำลองการอัปโหลดไฟล์
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 font-sans text-slate-800 flex flex-col relative overflow-hidden">
      
      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center max-w-3xl mx-auto">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 border border-blue-100">
                    <ShieldCheck size={14} /> AI-Powered Security
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                    Analyze suspicious <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                        URLs & QR Codes
                    </span>
                </h1>
                
                <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto">
                    ตรวจสอบลิงก์และไฟล์ที่น่าสงสัยด้วยระบบ AI อัจฉริยะ <br className="hidden md:block" />
                    ปกป้องข้อมูลส่วนตัวของคุณจากการถูกโจรกรรมข้อมูล
                </p>

                {/* Input Card */}
                <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-100 max-w-2xl mx-auto transform transition-all duration-300">
                    
                    {/* ปุ่มเลือก Tab */}
                    <div className="flex gap-2 mb-2 p-2 bg-slate-50/50 rounded-xl">
                        <TabButton 
                            id="url" 
                            icon={<Globe size={18} />} 
                            label="URL Link" 
                            active={activeTab} 
                            onClick={(id) => { setActiveTab(id); setFileName(''); }} 
                        />
                        <TabButton 
                            id="qr" 
                            icon={<QrCode size={18} />} 
                            label="QR Image" 
                            active={activeTab} 
                            onClick={(id) => { setActiveTab(id); setFileName(''); }} 
                        />
                    </div>

                    <div className="relative group">
                        
                        {/* 🟢 ส่วนแสดงผลแบบ URL (ช่องพิมพ์) */}
                        {activeTab === 'url' && (
                            <>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                    <Search size={20} />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="วางลิงก์ที่ต้องการตรวจสอบ (เช่น http://example.com)"
                                    className="w-full pl-12 pr-36 py-4 bg-white rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all border border-slate-200 focus:border-blue-500"
                                />
                            </>
                        )}

                        {/* 🟢 ส่วนแสดงผลแบบ QR Code (ปุ่มอัปโหลด) */}
                        {activeTab === 'qr' && (
                            <div className="relative">
                                <input 
                                    type="file" 
                                    id="qr-upload" 
                                    accept="image/*"
                                    className="hidden" 
                                    onChange={handleFileChange}
                                />
                                <label 
                                    htmlFor="qr-upload" 
                                    className="flex items-center w-full pl-4 pr-36 py-4 bg-white rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer transition-all group"
                                >
                                    <div className="mr-4 p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                        <Upload size={20} />
                                    </div>
                                    <span className={`text-sm ${fileName ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                                        {fileName ? fileName : "คลิกเพื่ออัปโหลดรูปภาพ QR Code"}
                                    </span>
                                </label>
                            </div>
                        )}
                        
                        {/* ปุ่มกดตรวจสอบ (ใช้ร่วมกัน) */}
                        <Link 
                            to="/result" 
                            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 hover:translate-x-1"
                        >
                            ตรวจสอบ <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12 text-sm font-semibold text-slate-500">
                <FeaturePill text="ไม่มีค่าใช้จ่าย" />
                <FeaturePill text="รู้ผลทันที" />
                <FeaturePill text="ปลอดภัย 100%" />
            </div>
        </div>
      </main>

      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
}

// Components Helper
function TabButton({ id, icon, label, active, onClick }) {
    const isActive = active === id;
    return (
        <button 
            onClick={() => onClick(id)}
            className={`flex-1 py-3 flex flex-row items-center justify-center gap-2 transition-all duration-200 relative text-sm font-medium rounded-lg
                ${isActive ? 'text-blue-600 bg-white shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
        >
            {icon} {label}
        </button>
    );
}

function FeaturePill({ text }) {
    return (
        <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm text-slate-600">
            <CheckCircle className="text-green-500" size={16} /> {text}
        </span>
    );
}