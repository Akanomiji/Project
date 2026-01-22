'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal'; // ✅ Import Modal
import { BookOpen, ArrowRight, Shield } from 'lucide-react';

export default function KnowledgePage() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    { id: 1, title: 'วิธีสังเกตลิงก์ปลอม (Phishing)', desc: 'เรียนรู้วิธีดู URL แปลกๆ ก่อนที่จะเผลอกด...', content: 'เนื้อหาแบบเต็ม: การสังเกตลิงก์ปลอมทำได้โดยดูที่ Domain Name เช่น faceb00k.com แทน facebook.com...' },
    { id: 2, title: 'รหัสผ่านที่ปลอดภัยคืออะไร?', desc: 'อย่าใช้ 123456! มาดูวิธีตั้งรหัสให้แฮกยาก...', content: 'เนื้อหาแบบเต็ม: ควรมีความยาวอย่างน้อย 12 ตัวอักษร ผสมตัวเล็ก ตัวใหญ่ ตัวเลข และอักขระพิเศษ...' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10">
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">คลังความรู้ไซเบอร์</h1>
            <p className="text-slate-500">รู้เท่าทันภัยออนไลน์ เพื่อความปลอดภัยของคุณ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
                <div key={article.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition group cursor-pointer" onClick={() => setSelectedArticle(article)}>
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{article.desc}</p>
                    <span className="text-sm text-blue-600 font-semibold flex items-center gap-1">อ่านต่อ <ArrowRight size={16} /></span>
                </div>
            ))}
        </div>
      </main>

      {/* ✅ Modal แสดงเนื้อหาบทความ */}
      <Modal
        isOpen={!!selectedArticle} // ถ้ามีข้อมูลบทความ ให้เปิด Modal
        onClose={() => setSelectedArticle(null)} // กดปิดแล้วเคลียร์ค่า
        title={selectedArticle?.title}
        footer={
            <button onClick={() => setSelectedArticle(null)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold">เข้าใจแล้ว</button>
        }
      >
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-blue-600 font-bold bg-blue-50 w-fit px-3 py-1 rounded-full">
                <Shield size={14} /> Knowledge Base
            </div>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p>{selectedArticle?.content}</p>
                <p className="text-slate-400 text-sm mt-4 italic">แหล่งที่มา: PhishWise Security Team</p>
            </div>
        </div>
      </Modal>

    </div>
  );
}