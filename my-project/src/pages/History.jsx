import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, ArrowLeft, FileText, Search } from 'lucide-react';

export default function HistoryPage() {
  // Mock Data: รายการที่ User เคยแจ้งไป
  const myReports = [
    { id: 1, url: 'http://scb-verify-login.com', type: 'Phishing', date: '12 ก.พ. 2026', status: 'Pending' },
    { id: 2, url: 'https://free-iphone-15.net', type: 'Scam', date: '10 ก.พ. 2026', status: 'Verified' },
    { id: 3, url: 'https://www.google.com', type: 'Other', date: '05 ก.พ. 2026', status: 'Rejected' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      <main className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-2 font-bold">
                    <ArrowLeft size={18} /> กลับ Dashboard
                </Link>
                <h1 className="text-3xl font-extrabold text-slate-800">ประวัติการแจ้งเบาะแส</h1>
                <p className="text-slate-500">ติดตามสถานะเว็บไซต์ที่คุณเคยแจ้งเข้ามา</p>
            </div>
            <Link to="/report" className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-lg shadow-lg shadow-red-200 hover:bg-red-700 transition flex items-center gap-2">
                + แจ้งเว็บใหม่
            </Link>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">URL / เว็บไซต์</th>
                            <th className="p-4">ประเภทภัยคุกคาม</th>
                            <th className="p-4">วันที่แจ้ง</th>
                            <th className="p-4 text-center">สถานะ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {myReports.map((report) => (
                            <tr key={report.id} className="hover:bg-slate-50 transition">
                                <td className="p-4 font-medium text-slate-800 font-mono">
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
            
            {myReports.length === 0 && (
                <div className="p-10 text-center text-slate-400">
                    <FileText size={48} className="mx-auto mb-3 opacity-20" />
                    <p>คุณยังไม่เคยแจ้งเบาะแสเว็บอันตราย</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
}