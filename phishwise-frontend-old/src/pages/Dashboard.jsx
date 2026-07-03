import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  History,
  AlertOctagon,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Map as MapIcon,
  Clock,
  ArrowRight,
  FileText,
  Lightbulb,
  CalendarDays,
  ChevronDown // 🔥 เพิ่มไอคอนลูกศร
} from "lucide-react";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import {
  ComposableMap, Geographies, Geography, Marker,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MemberDashboard() {
  const { user } = useAuth();
  
  // State 1: โหมดการดู (7d, 30d, หรือ yearly)
  const [viewMode, setViewMode] = useState("7d");
  
  // State 2: เลือกปี (สำหรับโหมด yearly)
  const [selectedYear, setSelectedYear] = useState("2025");

  // --- MOCK DATA (แยกเป็นรายช่วงเวลา และรายปี) ---
  const database = {
    // ข้อมูลระยะสั้น
    "7d": {
      graph: [
        { name: "จ.", safe: 5, threat: 0 },
        { name: "อ.", safe: 8, threat: 1 },
        { name: "พ.", safe: 4, threat: 0 },
        { name: "พฤ.", safe: 10, threat: 0 },
        { name: "ศ.", safe: 6, threat: 2 },
        { name: "ส.", safe: 3, threat: 0 },
        { name: "อา.", safe: 7, threat: 0 },
      ],
      totalScans: 43,
      threatsFound: 3,
      avgScore: 92,
      pendingReports: 2,
      resolvedReports: 5 
    },
    "30d": {
      graph: [
        { name: "W1", safe: 25, threat: 2 },
        { name: "W2", safe: 30, threat: 1 },
        { name: "W3", safe: 20, threat: 4 },
        { name: "W4", safe: 35, threat: 0 },
      ],
      totalScans: 110,
      threatsFound: 7,
      avgScore: 88,
      pendingReports: 5,
      resolvedReports: 12
    },
    // 🔥 ข้อมูลรายปี (แยกปี 2024, 2025)
    "2024": {
      graph: [
        { name: "ม.ค.", safe: 80, threat: 10 }, { name: "ก.พ.", safe: 90, threat: 5 },
        { name: "มี.ค.", safe: 70, threat: 12 }, { name: "เม.ย.", safe: 100, threat: 8 },
        { name: "พ.ค.", safe: 110, threat: 6 }, { name: "มิ.ย.", safe: 95, threat: 9 },
        { name: "ก.ค.", safe: 120, threat: 4 }, { name: "ส.ค.", safe: 130, threat: 3 },
        { name: "ก.ย.", safe: 115, threat: 7 }, { name: "ต.ค.", safe: 140, threat: 2 },
        { name: "พ.ย.", safe: 150, threat: 1 }, { name: "ธ.ค.", safe: 160, threat: 5 },
      ],
      totalScans: 1360,
      threatsFound: 72,
      avgScore: 85,
      pendingReports: 0,
      resolvedReports: 120
    },
    "2025": {
      graph: [
        { name: "ม.ค.", safe: 100, threat: 5 }, { name: "ก.พ.", safe: 120, threat: 2 },
        { name: "มี.ค.", safe: 90, threat: 8 }, { name: "เม.ย.", safe: 110, threat: 3 },
        { name: "พ.ค.", safe: 130, threat: 1 }, { name: "มิ.ย.", safe: 0, threat: 0 }, // ยังไม่ถึง
      ],
      totalScans: 550,
      threatsFound: 19,
      avgScore: 94,
      pendingReports: 8,
      resolvedReports: 45
    }
  };

  // Logic เลือกข้อมูลมาแสดง
  const currentStats = viewMode === "yearly" 
    ? database[selectedYear] 
    : database[viewMode];

  // Helper สำหรับเปลี่ยนโหมด
  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  const recentHistory = [
    { id: 1, url: "http://free-gift-card.com", status: "phishing", score: 10, date: "10 นาทีที่แล้ว" },
    { id: 2, url: "https://google.com", status: "safe", score: 100, date: "2 ชั่วโมงที่แล้ว" },
  ];

  const mapMarkers = [{ name: "Bangkok", coordinates: [100.5018, 13.7563] }];
  const securityTip = { title: "ระวัง! QR Code ปลอม", content: "ตรวจสอบชื่อปลายทางก่อนโอนเงินเสมอ", tag: "Tip" };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
        
        {/* --- 1. HEADER & CONTROLS --- */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              หน้าจอแสดงผลสถิติของฉัน
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              ยินดีต้อนรับ, <span className="text-blue-600 font-bold">{user?.name || "User"}</span> 👋
            </p>
          </div>
          
          {/* 🔥 ส่วนควบคุมเวลา (Time Selector) ปรับปรุงใหม่ */}
          <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1">
             
             {/* ปุ่ม 7 วัน */}
             <button 
                onClick={() => handleViewChange("7d")}
                className={`px-4 py-2 text-sm font-bold rounded-md transition ${viewMode === '7d' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               7 วัน
             </button>

             {/* ปุ่ม 30 วัน */}
             <button 
                onClick={() => handleViewChange("30d")}
                className={`px-4 py-2 text-sm font-bold rounded-md transition ${viewMode === '30d' ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               30 วัน
             </button>

             {/* Divider */}
             <div className="w-px h-6 bg-slate-200 mx-1"></div>

             {/* Dropdown เลือกปี */}
             <div className="relative">
                <select
                  value={viewMode === 'yearly' ? selectedYear : ''} // ถ้าไม่ได้เลือกรายปี ให้ value ว่าง (หรือจะจัดการ UI แบบอื่นก็ได้)
                  onChange={(e) => {
                    setViewMode("yearly");
                    setSelectedYear(e.target.value);
                  }}
                  className={`appearance-none pl-4 pr-10 py-2 text-sm font-bold rounded-md outline-none cursor-pointer transition ${viewMode === 'yearly' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <option value="2025">ปี 2025</option>
                  <option value="2024">ปี 2024</option>
                </select>
                <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${viewMode === 'yearly' ? 'text-blue-700' : 'text-slate-400'}`} />
             </div>
          </div>
        </div>

        {/* --- 2. STATS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="สแกนทั้งหมด" 
            value={currentStats.totalScans} 
            subtitle={viewMode === 'yearly' ? `สถิติปี ${selectedYear}` : viewMode === '30d' ? '30 วันล่าสุด' : '7 วันล่าสุด'}
            icon={<Activity size={24} className="text-blue-600" />} 
            color="bg-blue-50 border-blue-100 text-blue-700"
          />
          <StatCard 
            title="ภัยคุกคามที่พบ" 
            value={currentStats.threatsFound} 
            subtitle="ลิงก์อันตราย"
            icon={<AlertOctagon size={24} className="text-red-600" />} 
            color="bg-red-50 border-red-100 text-red-700"
          />
          <StatCard 
            title="Score ความปลอดภัย" 
            value={`${currentStats.avgScore}%`} 
            subtitle="เฉลี่ยรวม"
            icon={<ShieldCheck size={24} className="text-green-600" />} 
            color="bg-green-50 border-green-100 text-green-700"
          />
          <Link to="/history" className="block">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition flex items-center justify-between cursor-pointer group">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">การแจ้งเบาะแส</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold text-slate-900">{currentStats.pendingReports}</h2>
                  <span className="text-xs text-orange-500 font-bold">รอตรวจสอบ</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">เสร็จสิ้นแล้ว {currentStats.resolvedReports} เรื่อง</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 group-hover:bg-orange-100 transition">
                <FileText size={24} />
              </div>
            </div>
          </Link>
        </div>

        {/* --- 3. GRAPH & MAP --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Activity size={20} className="text-blue-500"/> สถิติการใช้งาน
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                <CalendarDays size={14} />
                <span>
                    {viewMode === 'yearly' ? `ข้อมูลรายเดือน ปี ${selectedYear}` : viewMode === '30d' ? 'รายสัปดาห์ (30 วัน)' : 'รายวัน (7 วัน)'}
                </span>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentStats.graph}>
                  <defs>
                    <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                  <Area type="monotone" dataKey="safe" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSafe)" name="ปลอดภัย" />
                  <Area type="monotone" dataKey="threat" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorThreat)" name="อันตราย" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Map + Tip (ส่วนขวา) */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-64">
              <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                 <MapIcon size={20} className="text-blue-500"/> แหล่งภัยคุกคาม
              </h3>
              <div className="flex-1 rounded-xl overflow-hidden bg-blue-50/50 border border-blue-100">
                 <ComposableMap projectionConfig={{ scale: 160 }} className="w-full h-full object-contain">
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#cbd5e1"
                            stroke="#f8fafc"
                            strokeWidth={0.5}
                            style={{ default: { outline: "none" }, hover: { fill: "#94a3b8", outline: "none" }, pressed: { outline: "none" } }}
                          />
                        ))
                      }
                    </Geographies>
                    {mapMarkers.map(({ name, coordinates }) => (
                      <Marker key={name} coordinates={coordinates}>
                        <circle r={5} fill="#ef4444" stroke="#fff" strokeWidth={1.5} />
                      </Marker>
                    ))}
                 </ComposableMap>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
               <div className="flex items-start justify-between relative z-10">
                 <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                   {securityTip.tag}
                 </div>
                 <Lightbulb size={24} className="text-yellow-300" />
               </div>
               <div className="mt-4 relative z-10">
                 <h4 className="font-bold text-lg mb-1">{securityTip.title}</h4>
                 <p className="text-indigo-100 text-sm leading-relaxed">
                   {securityTip.content}
                 </p>
               </div>
               <Link to="/knowledge" className="mt-4 text-xs font-bold text-indigo-200 hover:text-white flex items-center gap-1 transition relative z-10">
                 อ่านเพิ่มเติม <ArrowRight size={14} />
               </Link>
            </div>
          </div>
        </div>

        {/* --- 4. RECENT HISTORY --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <History size={20} className="text-blue-500"/> ประวัติการสแกนล่าสุด
            </h3>
            <Link to="/scan-history" className="text-sm text-blue-600 font-bold hover:underline">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentHistory.map((item) => (
              <HistoryItem key={item.id} {...item} />
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

// Sub-Components
function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h2 className="text-3xl font-bold text-slate-900">{value}</h2>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className={`p-4 rounded-xl ${color} bg-opacity-20`}>
        {icon}
      </div>
    </div>
  );
}

function HistoryItem({ url, status, date, score }) {
  const isSafe = status === "safe";
  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${isSafe ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
          {isSafe ? <CheckCircle2 size={20} /> : <AlertOctagon size={20} />}
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm md:text-base">{url}</p>
          <p className="text-xs text-slate-500">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-slate-400">Score</p>
          <span className={`font-bold ${score >= 80 ? 'text-green-600' : 'text-red-600'}`}>{score}/100</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${isSafe ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {isSafe ? "ปลอดภัย" : "อันตราย"}
        </div>
      </div>
    </div>
  );
}