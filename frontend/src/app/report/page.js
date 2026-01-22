'use client';
import Link from 'next/link';
import { AlertTriangle, Send, Image as ImageIcon } from 'lucide-react';

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col items-center py-10">
        <div className="w-full max-w-lg px-4">
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-blue-600 mb-6 block">← กลับ Dashboard</Link>
            
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">แจ้งเบาะแสเว็บอันตราย</h1>
                <p className="text-slate-500">ช่วยกันสร้างสังคมออนไลน์ที่ปลอดภัยด้วยการรายงานลิงก์ที่น่าสงสัย</p>
            </div>

            <form className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">URL เว็บไซต์ *</label>
                    <input type="url" placeholder="https://example.com/phishing" className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none" required />
                </div>
                
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">ประเภทภัยคุกคาม</label>
                    <select className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none">
                        <option>Phishing (เว็บปลอมหลอกเอาข้อมูล)</option>
                        <option>Malware (หลอกให้ดาวน์โหลดไฟล์ไวรัส)</option>
                        <option>Scam (หลอกลวงซื้อขาย/ลงทุน)</option>
                        <option>อื่นๆ</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">รายละเอียดเพิ่มเติม</label>
                    <textarea rows="3" placeholder="อธิบายลักษณะการหลอกลวง..." className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">หลักฐาน (Screenshot)</label>
                    <div className="w-full border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-white hover:border-red-400 transition cursor-pointer">
                        <ImageIcon size={24} className="mb-2"/>
                        <span className="text-xs">คลิกเพื่ออัปโหลดรูปภาพ</span>
                    </div>
                </div>

                <button type="submit" className="w-full py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transition flex items-center justify-center gap-2 mt-2">
                    <Send size={18} /> ส่งรายงาน
                </button>
            </form>
        </div>
    </div>
  );
}