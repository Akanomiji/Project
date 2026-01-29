import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Search, Filter, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

// ------------------------------------------
// 1. Mock Data (เพิ่ม field 'category' และเพิ่มจำนวนข้อมูล)
// ------------------------------------------
const articles = [
  { 
    id: 1, 
    title: 'เจาะลึก: วิธีสังเกตลิงก์ปลอม (Phishing) แบบมือโปร', 
    category: 'Phishing',
    desc: 'เรียนรู้วิธีดู URL แปลกๆ ก่อนที่จะเผลอกด พลาดนิดเดียวอาจสูญเงินได้...', 
  },
  { 
    id: 2, 
    title: 'รหัสผ่านที่ปลอดภัยคืออะไร?', 
    category: 'Security',
    desc: 'อย่าใช้ 123456! มาดูวิธีตั้งรหัสให้แฮกยาก แต่จำง่ายกันดีกว่า...', 
  },
  { 
    id: 3, 
    title: 'เตือนภัย! แก๊งคอลเซ็นเตอร์รูปแบบใหม่', 
    category: 'Scams',
    desc: 'แอบอ้างเป็นกรมที่ดิน ตำรวจ หรือธนาคาร ต้องรับมืออย่างไร?', 
  },
  { 
    id: 4, 
    title: 'Malware เรียกค่าไถ่ (Ransomware) คืออะไร?', 
    category: 'Malware',
    desc: 'เมื่อไฟล์ในเครื่องถูกล็อคและเรียกเงิน จะแก้ยังไง ป้องกันได้ไหม?', 
  },
  { 
    id: 5, 
    title: 'ช้อปปิ้งออนไลน์ยังไงไม่ให้โดนโกง', 
    category: 'Scams',
    desc: 'เทคนิคเช็คเครดิตร้านค้า และการจ่ายเงินที่ปลอดภัยที่สุด', 
  },
  { 
    id: 6, 
    title: '2FA คืออะไร? ทำไมต้องเปิดเดี๋ยวนี้', 
    category: 'Security',
    desc: 'การยืนยันตัวตนสองชั้น เกราะป้องกันสุดท้ายที่แฮกเกอร์กลัว', 
  },
  { 
    id: 7, 
    title: 'หลอกลงทุน Crypto ระบาดหนัก', 
    category: 'Scams',
    desc: 'ผลตอบแทนสูงเกินจริง? ระวังแชร์ลูกโซ่ในคราบการลงทุน', 
  },
  { 
    id: 8, 
    title: 'Social Engineering: จิตวิทยาการหลอกลวง', 
    category: 'Phishing',
    desc: 'แฮกคนง่ายกว่าแฮกระบบ! รู้ทันเทคนิคปั่นหัวเหยื่อ', 
  },
];

// ดึงหมวดหมู่ทั้งหมดออกมา (Unique Categories)
const categories = ['ทั้งหมด', ...new Set(articles.map(a => a.category))];

export default function KnowledgePage() {
  // ------------------------------------------
  // 2. State Management
  // ------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // แสดงหน้าละ 6 บทความ

  // ------------------------------------------
  // 3. Logic: Filter & Search
  // ------------------------------------------
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ทั้งหมด' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ------------------------------------------
  // 4. Logic: Pagination Calculation
  // ------------------------------------------
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  // เปลี่ยนหน้าและกลับไปบนสุด
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-10">
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">คลังความรู้ไซเบอร์</h1>
            <p className="text-slate-500">รู้เท่าทันภัยออนไลน์ เพื่อความปลอดภัยของคุณ</p>
        </div>

        {/* ------------------------------------------ */}
        {/* 5. Search & Filter Bar */}
        {/* ------------------------------------------ */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="ค้นหาบทความ..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // รีเซ็ตหน้าเมื่อค้นหาใหม่
                    }}
                />
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="text-slate-400 hidden md:block" size={20} />
                <select 
                    className="w-full md:w-48 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-slate-700 font-medium"
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1); // รีเซ็ตหน้าเมื่อเปลี่ยนหมวดหมู่
                    }}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* ------------------------------------------ */}
        {/* 6. Articles Grid */}
        {/* ------------------------------------------ */}
        {paginatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {paginatedArticles.map((article) => (
                    <Link to={`/knowledge/${article.id}`} key={article.id} className="group">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col relative overflow-hidden">
                            
                            {/* Category Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md border border-slate-200">
                                    {article.category}
                                </span>
                            </div>

                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen size={24} />
                            </div>
                            
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {article.title}
                            </h3>
                            
                            <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-3">
                                {article.desc}
                            </p>
                            
                            <div className="mt-auto flex items-center text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                                อ่านเพิ่มเติม <ArrowRight size={16} className="ml-1" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            // กรณีไม่เจอข้อมูล
            <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-600">ไม่พบบทความที่คุณค้นหา</h3>
                <p className="text-slate-400">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นดูนะครับ</p>
            </div>
        )}

        {/* ------------------------------------------ */}
        {/* 7. Pagination Controls */}
        {/* ------------------------------------------ */}
        {filteredArticles.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-2">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronLeft size={20} className="text-slate-600" />
                </button>
                
                {/* Page Numbers */}
                <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                                currentPage === page
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                >
                    <ChevronRight size={20} className="text-slate-600" />
                </button>
            </div>
        )}

      </main>
    </div>
  );
}