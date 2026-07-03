import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Send, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ReportPage() {
  const [formData, setFormData] = useState({ url: '', type: 'Phishing', desc: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 📨 ตรงนี้ถ้ามี backend จริงจะส่งข้อมูลไป
    // แต่นี้ Mockup ให้โชว์หน้า Success เลย
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full text-center animate-fade-in-up">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">ขอบคุณสำหรับการแจ้งเบาะแส!</h2>
          <p className="text-slate-500 mb-6">ข้อมูลของคุณถูกส่งไปยังผู้ดูแลระบบแล้ว เราจะทำการตรวจสอบและอัปเดตสถานะให้ทราบโดยเร็วที่สุด</p>
          <div className="flex flex-col gap-2">
             <Link to="/history" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                ดูสถานะการแจ้ง
             </Link>
             <Link to="/dashboard" className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition">
                กลับหน้าหลัก
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      <main className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        
        {/* Header */}
        <div className="mb-8">
            {/* <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-4 font-bold">
                <ArrowLeft size={18} /> กลับ Dashboard
            </Link> */}
            <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                <AlertTriangle className="text-red-500" size={32} /> แจ้งเบาะแสเว็บอันตราย
            </h1>
            <p className="text-slate-500 mt-2">พบเจอเว็บไซต์ต้องสงสัย? แจ้งให้เราทราบเพื่อตรวจสอบและปกป้องชุมชน</p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">URL ของเว็บไซต์ (ที่ต้องสงสัย)</label>
                    <input 
                        required
                        type="url" 
                        placeholder="https://example-phishing.com" 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition"
                        value={formData.url}
                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ประเภทของภัยคุกคาม</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {['Phishing (เว็บปลอม)', 'Scam (หลอกลวง)', 'Malware (ไวรัส)', 'Gambling (พนัน)', 'Fake News (ข่าวปลอม)', 'Other (อื่นๆ)'].map((type) => (
                            <label key={type} className={`cursor-pointer border p-3 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${formData.type === type.split(' ')[0] ? 'bg-red-50 border-red-500 text-red-600' : 'border-slate-200 hover:bg-slate-50'}`}>
                                <input 
                                    type="radio" 
                                    name="type" 
                                    className="hidden" 
                                    value={type.split(' ')[0]} 
                                    onChange={() => setFormData({...formData, type: type.split(' ')[0]})}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">รายละเอียดเพิ่มเติม (ถ้ามี)</label>
                    <textarea 
                        rows="4" 
                        placeholder="เช่น ได้รับ SMS แจ้งว่าบัญชีถูกระงับ แล้วให้กดลิงก์นี้..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition"
                        value={formData.desc}
                        onChange={(e) => setFormData({...formData, desc: e.target.value})}
                    ></textarea>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 flex items-center justify-center gap-2 transition-all active:scale-95">
                        <Send size={20} /> ยืนยันการแจ้งเบาะแส
                    </button>
                </div>

            </form>
        </div>

      </main>
    </div>
  );
}