import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

// ข้อมูลจำลอง (ในอนาคตควรดึงจาก Database)
const articles = [
  { id: 1, title: 'วิธีสังเกตลิงก์ปลอม (Phishing)', desc: 'เรียนรู้วิธีดู URL แปลกๆ ก่อนที่จะเผลอกด...', content: '...' },
  { id: 2, title: 'รหัสผ่านที่ปลอดภัยคืออะไร?', desc: 'อย่าใช้ 123456! มาดูวิธีตั้งรหัสให้แฮกยาก...', content: '...' },
];

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10">
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">คลังความรู้ไซเบอร์</h1>
            <p className="text-slate-500">รู้เท่าทันภัยออนไลน์ เพื่อความปลอดภัยของคุณ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
                // ✅ ใช้ Link ส่งไปที่หน้า /knowledge/[id]
                <Link href={`/knowledge/${article.id}`} key={article.id} className="group">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer h-full flex flex-col">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <BookOpen size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                        <p className="text-sm text-slate-500 mb-4 flex-1">{article.desc}</p>
                        <span className="text-sm text-blue-600 font-semibold flex items-center gap-1 mt-auto">
                            อ่านต่อ <ArrowRight size={16} />
                        </span>
                    </div>
                </Link>
            ))}
        </div>
      </main>
    </div>
  );
}