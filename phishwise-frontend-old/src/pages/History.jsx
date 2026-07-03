import { useState, useEffect } from 'react'; // เพิ่ม useEffect
import { Link } from 'react-router-dom';
import { 
  Clock, CheckCircle2, XCircle, ArrowLeft, FileText, Search,
  ChevronLeft, ChevronRight, Filter // เพิ่ม Filter icon
} from 'lucide-react';

export default function HistoryPage() {
  // 1. Mock Data
  const myReports = [
    { id: 1, url: 'http://scb-verify-login.com', type: 'Phishing', date: '12 ก.พ. 2026', status: 'Pending' },
    { id: 2, url: 'https://free-iphone-15.net', type: 'Scam', date: '10 ก.พ. 2026', status: 'Verified' },
    { id: 3, url: 'https://www.google.com', type: 'Other', date: '05 ก.พ. 2026', status: 'Rejected' },
    { id: 4, url: 'http://bit.ly/fake-bank', type: 'Phishing', date: '04 ก.พ. 2026', status: 'Pending' },
    { id: 5, url: 'https://secure-pay-web.com', type: 'Scam', date: '03 ก.พ. 2026', status: 'Verified' },
    { id: 6, url: 'http://malware-site.net', type: 'Malware', date: '02 ก.พ. 2026', status: 'Pending' },
    { id: 7, url: 'https://verify-account.io', type: 'Phishing', date: '01 ก.พ. 2026', status: 'Rejected' },
  ];

  // 2. States สำหรับ Search, Filter และ Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 3. Logic การกรองข้อมูล (ทำงานก่อน Pagination)
  const filteredReports = myReports.filter((report) => {
    const matchesSearch = report.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" ? true : report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // รีเซ็ตหน้ากลับไปที่ 1 เมื่อมีการค้นหาหรือกรองข้อมูล
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // 4. คำนวณ Pagination จากข้อมูลที่กรองแล้ว
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      <main className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800">ประวัติการแจ้งเบาะแส</h1>
            <p className="text-slate-500">ติดตามสถานะเว็บไซต์ที่คุณเคยแจ้งเข้ามา</p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="ค้นหา URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            <button 
              onClick={() => setStatusFilter("All")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${statusFilter === 'All' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              ทั้งหมด
            </button>
            <button 
              onClick={() => setStatusFilter("Pending")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${statusFilter === 'Pending' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              รอตรวจ
            </button>
            <button 
              onClick={() => setStatusFilter("Verified")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${statusFilter === 'Verified' ? 'bg-green-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              อนุมัติ
            </button>
            <button 
              onClick={() => setStatusFilter("Rejected")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${statusFilter === 'Rejected' ? 'bg-slate-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              ปฏิเสธ
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4 w-16 text-center">#</th>
                            <th className="p-4">URL / เว็บไซต์</th>
                            <th className="p-4">ประเภทภัยคุกคาม</th>
                            <th className="p-4">วันที่แจ้ง</th>
                            <th className="p-4 text-center">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {currentItems.map((report) => (
                            <tr key={report.id} className="hover:bg-slate-50 transition">
                                <td className="p-4 text-center text-slate-400">{report.id}</td>
                                <td className="p-4 font-medium text-slate-800 font-mono text-xs md:text-sm truncate max-w-[200px] md:max-w-xs">
                                    {report.url}
                                </td>
                                <td className="p-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                                        {report.type}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500">{report.date}</td>
                                <td className="p-4 text-center">
                                    {report.status === 'Pending' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                            <Clock size={14} /> รอตรวจสอบ
                                        </span>
                                    )}
                                    {report.status === 'Verified' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                            <CheckCircle2 size={14} /> อนุมัติแล้ว (อันตราย)
                                        </span>
                                    )}
                                    {report.status === 'Rejected' && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                            <XCircle size={14} /> ปฏิเสธ (ปลอดภัย)
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* ส่วนควบคุม Pagination */}
            {filteredReports.length > 0 ? (
              <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 bg-slate-50/50 gap-4">
                <div className="text-sm text-slate-500 order-2 sm:order-1">
                  แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, filteredReports.length)} จาก {filteredReports.length} รายการ
                </div>
                
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition ${
                          currentPage === index + 1
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
                <div className="p-10 text-center text-slate-400">
                    <FileText size={48} className="mx-auto mb-3 opacity-20" />
                    <p>ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
}