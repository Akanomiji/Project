import { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertOctagon, 
  Activity,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";

export default function ScanHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [scanData, setScanData] = useState([
    { id: 1, url: "https://secure-bank-login.com/verify", status: "phishing", score: 10, date: "12 ต.ค. 2023, 10:30" },
    { id: 2, url: "https://www.google.com", status: "safe", score: 100, date: "12 ต.ค. 2023, 09:15" },
    { id: 3, url: "http://free-iphone-15.net", status: "phishing", score: 5, date: "11 ต.ค. 2023, 18:20" },
    { id: 4, url: "https://github.com", status: "safe", score: 98, date: "11 ต.ค. 2023, 14:00" },
    { id: 5, url: "https://facebook.com", status: "safe", score: 100, date: "10 ต.ค. 2023, 09:00" },
    { id: 6, url: "http://fake-update-browser.io", status: "phishing", score: 12, date: "09 ต.ค. 2023, 15:45" },
    { id: 7, url: "https://shopee-win-prizes.net", status: "phishing", score: 8, date: "08 ต.ค. 2023, 11:20" },
    { id: 8, url: "https://youtube.com", status: "safe", score: 100, date: "07 ต.ค. 2023, 20:10" },
  ]);

  const filteredData = scanData.filter((item) => {
    const matchesSearch = item.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterType === "ALL" ? true :
      filterType === "SAFE" ? item.status === "safe" :
      item.status !== "safe";
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (id) => {
    if(window.confirm("ต้องการลบประวัตินี้ใช่หรือไม่?")) {
        setScanData(scanData.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* Header */}
        <div className="mb-8 border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="text-blue-600" /> ประวัติการสแกนลิงก์
          </h1>
          <p className="text-slate-500 mt-2">รายการ URL ที่คุณเคยตรวจสอบความปลอดภัยย้อนหลัง</p>
        </div>

        {/* Controls (Search & Filter) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหา URL..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
            {["ALL", "THREAT", "SAFE"].map((type) => (
                <button 
                  key={type}
                  onClick={() => setFilterType(type)} 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                    filterType === type ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
                  }`}
                >
                  {type === "ALL" ? "ทั้งหมด" : type === "THREAT" ? "พบความเสี่ยง" : "ปลอดภัย"}
                </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {currentItems.length > 0 ? (
            <>
              <div className="divide-y divide-slate-100">
                {currentItems.map((item, index) => {
                  // คำนวณลำดับที่รันต่อเนื่อง
                  const orderNumber = ((currentPage - 1) * itemsPerPage) + (index + 1);

                  return (
                    <div key={item.id} className="p-5 hover:bg-slate-50 transition flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group">
                      <div className="flex items-start gap-4 overflow-hidden flex-1">
                        
                        {/* ส่วนที่เพิ่ม: ตัวเลขลำดับ */}
                        <div className="mt-2 text-m font-bold text-slate-1000 w-6 shrink-0">
                          {orderNumber.toString().padStart(2, '')}
                        </div>

                        <div className={`mt-1 p-2 rounded-full shrink-0 ${item.status === "safe" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {item.status === "safe" ? <CheckCircle2 size={20} /> : <AlertOctagon size={20} />}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <p className="text-slate-900 font-bold truncate text-lg">{item.url}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-2">
                            {item.date} 
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            Score: <span className={item.score >= 80 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>{item.score}/100</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-lg transition"><ExternalLink size={18} /></a>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination UI */}
              <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-sm text-slate-500 font-medium">
                  รายการที่ {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} จาก {filteredData.length}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <Activity size={48} className="mx-auto mb-3 opacity-20" />
              <p className="text-lg">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}