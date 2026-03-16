import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, ArrowRight, Search, Filter, 
  ChevronLeft, ChevronRight, FileText, ChevronDown 
} from 'lucide-react';

// ------------------------------------------
// 1. Mock Data (เพิ่มเป็น 12 รายการเพื่อทดสอบ Pagination)
// ------------------------------------------
const articles = [
  { id: 1, title: 'วิธีสังเกตลิงก์ปลอม (Phishing) แบบมือโปร', category: 'Phishing', desc: 'เรียนรู้วิธีดู URL แปลกๆ ก่อนที่จะเผลอกด พลาดนิดเดียวอาจสูญเงินได้...', image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'รหัสผ่านที่ปลอดภัยคืออะไร?', category: 'Security', desc: 'อย่าใช้ 123456! มาดูวิธีตั้งรหัสให้แฮกยาก แต่จำง่ายกันดีกว่า...', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'เตือนภัย! แก๊งคอลเซ็นเตอร์รูปแบบใหม่', category: 'Scams', desc: 'แอบอ้างเป็นกรมที่ดิน ตำรวจ หรือธนาคาร ต้องรับมืออย่างไร?', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Ransomware คืออะไร? และวิธีป้องกัน', category: 'Malware', desc: 'รู้จักมัลแวร์เรียกค่าไถ่ที่อันตรายที่สุด พร้อมวิธีสำรองข้อมูลที่ถูกต้อง', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' },
  { id: 5, title: '2FA คืออะไร ทำไมต้องเปิดใช้งาน?', category: 'Security', desc: 'เพิ่มความปลอดภัยอีกชั้นให้บัญชีของคุณด้วยการยืนยันตัวตนแบบสองปัจจัย', image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800' },
  { id: 6, title: 'Public Wi-Fi อันตรายแค่ไหน?', category: 'Security', desc: 'เล่นเน็ตฟรีที่ห้างหรือสนามบินอย่างไรให้ปลอดภัยจากการโดนดักข้อมูล', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800' },
  { id: 7, title: 'Deepfake: ภัยเงียบจาก AI', category: 'Scams', desc: 'เมื่อวิดีโอและเสียงถูกปลอมแปลงได้แนบเนียน เราจะแยกแยะได้อย่างไร?', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' },
  { id: 8, title: 'วิธีเช็กว่าข้อมูลหลุดไปใน Dark Web หรือไม่', category: 'Privacy', desc: 'สอนใช้เครื่องมือตรวจสอบอีเมลและเบอร์โทรศัพท์ว่าถูกแฮกไปแล้วหรือยัง', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800' },
  { id: 9, title: 'แอปดูดเงิน: กลโกงสายชาร์จและ Accessibility', category: 'Malware', desc: 'เจาะลึกกลไกที่มิจฉาชีพใช้ควบคุมมือถือของคุณจากระยะไกล', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=800' },
  { id: 10, title: 'ทำความรู้จักกับ Social Engineering', category: 'Scams', desc: 'ศิลปะการหลอกลวงที่ไม่ได้ใช้แค่โค้ด แต่ใช้ "จิตวิทยา" เข้าช่วย', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800' },
  { id: 11, title: 'ปลอดภัยเมื่อช้อปปิ้งออนไลน์', category: 'Privacy', desc: '7 เทคนิคซื้อของบนแอปดังอย่างไร ไม่ให้โดนโกงเงินหรือโดนขโมยบัตรเครดิต', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800' },
  { id: 12, title: 'จัดการ Cookie ใน Browser เพื่อความเป็นส่วนตัว', category: 'Privacy', desc: 'คุกกี้ไม่ได้มีไว้กิน! มารู้จักวิธีตั้งค่าไม่ให้เว็บต่างๆ ติดตามพฤติกรรมเรา', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800' },
];

export default function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // แสดงหน้าละ 6 รายการ

  const categories = ["All", "Phishing", "Scams", "Malware", "Security", "Privacy"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // เมื่อค้นหาหรือเปลี่ยนหมวดหมู่ ให้กลับไปหน้า 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory]);

  const filteredArticles = articles.filter(art => {
    const matchSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = activeCategory === "All" || art.category === activeCategory;
    return matchSearch && matchCat;
  });

  // คำนวณข้อมูลสำหรับ Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const currentItems = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <main className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
                <BookOpen size={18} /> Knowledge Center
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">คลังความรู้ไซเบอร์</h1>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text"
                    placeholder="ค้นหาบทความ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="relative w-full md:w-64" ref={dropdownRef}>
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm font-bold"
                >
                    <span className="flex items-center gap-2"><Filter size={18} className="text-blue-500" /> {activeCategory === "All" ? "หมวดหมู่ทั้งหมด" : activeCategory}</span>
                    <ChevronDown size={18} className={`${isDropdownOpen ? 'rotate-180' : ''} transition-transform`} />
                </button>
                {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); setIsDropdownOpen(false); }}
                                className={`w-full text-left px-5 py-3 text-sm font-medium ${activeCategory === cat ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50'}`}
                            >
                                {cat === "All" ? "ทั้งหมด" : cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Grid Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((art) => (
                <Link key={art.id} to={`/knowledge/${art.id}`} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                    <div className="aspect-video overflow-hidden">
                        <img src={art.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                        <span className="text-xs font-black text-blue-500 uppercase mb-2 block">{art.category}</span>
                        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{art.title}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2">{art.desc}</p>
                    </div>
                </Link>
            ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-16">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${
                            currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-slate-200'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
            </div>
        )}
      </main>
    </div>
  );
}