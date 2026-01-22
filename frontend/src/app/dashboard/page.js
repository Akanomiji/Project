'use client';
import Link from 'next/link';
import { History, AlertOctagon, CheckCircle2, FileText, Globe, Activity, ArrowRight } from 'lucide-react';
// import Navbar from '@/components/Navbar'; // (ถ้า layout.js มีแล้ว ไม่ต้องใส่)

// 1. Library กราฟ
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// 2. Library แผนที่ (มาใหม่) ✅
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// URL ไฟล์แผนที่โลก (มาตรฐาน)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MemberDashboard() {
  
  // ข้อมูลกราฟ
  const graphData = [
    { name: 'ม.ค.', safe: 40, threat: 2 },
    { name: 'ก.พ.', safe: 30, threat: 5 },
    { name: 'มี.ค.', safe: 55, threat: 1 },
    { name: 'เม.ย.', safe: 80, threat: 8 },
    { name: 'พ.ค.', safe: 65, threat: 3 },
    { name: 'มิ.ย.', safe: 95, threat: 0 },
  ];

  // ข้อมูลจุดโจมตีบนแผนที่ (Latitude, Longitude)
  const threats = [
    { name: "USA", coordinates: [-100, 40], delay: 0 },
    { name: "Brazil", coordinates: [-55, -10], delay: 1 },
    { name: "Russia", coordinates: [100, 60], delay: 0.5 },
    { name: "China", coordinates: [110, 35], delay: 1.5 },
    { name: "India", coordinates: [78, 20], delay: 2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
       
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Member Dashboard 👋</h1>
                <p className="text-slate-500">สถานะความปลอดภัยของคุณอยู่ในเกณฑ์ <span className="text-green-600 font-bold">ยอดเยี่ยม</span></p>
            </div>
            <Link href="/" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-200 transition flex items-center gap-2">
                <Activity size={18} /> สแกนลิงก์ใหม่
            </Link>
        </div>

        {/* 1. Cards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="เว็บไซต์ที่ตรวจสอบแล้ว" value="365" sub="เพิ่มขึ้น 12% จากเดือนก่อน" icon={<History />} color="text-blue-600 bg-blue-50" />
            <StatCard label="พบภัยคุกคาม" value="19" sub="ป้องกันได้ทั้งหมด" icon={<AlertOctagon />} color="text-red-600 bg-red-50" />
            <StatCard label="รายงานความปลอดภัย" value="12" sub="ดาวน์โหลดได้" icon={<FileText />} color="text-purple-600 bg-purple-50" />
        </div>

        {/* ส่วนกราฟและแผนที่ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 2. 📈 กราฟสถิติ (recharts) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <Activity className="text-blue-500" size={20}/> สถิติการตรวจสอบย้อนหลัง
                    </h3>
                    <select className="text-sm border-slate-200 rounded-lg p-1 bg-slate-50 text-slate-500">
                        <option>6 เดือนล่าสุด</option>
                        <option>ปีนี้</option>
                    </select>
                </div>
                
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={graphData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="safe" name="ปลอดภัย" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorSafe)" />
                            <Area type="monotone" dataKey="threat" name="อันตราย" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorThreat)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. 🌍 Global Threat Map (react-simple-maps) */}
            <div className="bg-[#1e293b] p-6 rounded-2xl shadow-lg border border-slate-700 text-white relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Globe className="text-blue-400" size={20}/> Live Threat Map
                        </h3>
                        <p className="text-slate-400 text-sm">แหล่งที่มาของการโจมตีล่าสุด</p>
                    </div>
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </div>

                {/* ตัวแผนที่ */}
                <div className="flex-1 w-full h-full -ml-4 mt-4">
                    <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
                        {/* วาดประเทศ */}
                        <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#334155" // สีประเทศ (Slate-700)
                                stroke="#1e293b" // สีขอบ (Slate-800)
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "#475569", outline: "none" },
                                    pressed: { outline: "none" },
                                }}
                            />
                            ))
                        }
                        </Geographies>

                        {/* จุด Marker สีแดงกระพริบ */}
                        {threats.map(({ name, coordinates, delay }) => (
                            <Marker key={name} coordinates={coordinates}>
                                <circle r={4} fill="#ef4444" stroke="#fff" strokeWidth={1} className="animate-ping opacity-75" style={{ animationDuration: '2s', animationDelay: `${delay}s` }} />
                                <circle r={3} fill="#ef4444" />
                            </Marker>
                        ))}
                    </ComposableMap>
                </div>
                
                <div className="flex gap-4 text-xs text-slate-400 mt-2">
                     <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> High Risk</span>
                     <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600"></span> Safe Zone</span>
                </div>
            </div>

        </div>

        {/* 4. Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-slate-900">ประวัติการตรวจสอบล่าสุด</h3>
                 <Link href="#" className="text-sm text-blue-600 font-bold hover:underline">ดูทั้งหมด</Link>
             </div>
             <div className="divide-y divide-slate-100">
                <HistoryItem url="http://example-bank-login.com" status="danger" date="12 ม.ค. 67 - 14:30" score={15} />
                <HistoryItem url="https://shopee.co.th" status="safe" date="12 ม.ค. 67 - 09:15" score={98} />
             </div>
        </div>

      </main>
    </div>
  );
}

// --- Components ย่อย ---
function StatCard({ label, value, sub, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start justify-between hover:shadow-md transition">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{value}</h3>
                {sub && <p className="text-xs text-slate-400">{sub}</p>}
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                {icon}
            </div>
        </div>
    );
}

function HistoryItem({ url, status, date, score }) {
    const isSafe = status === 'safe';
    return (
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition">
            <div className="flex items-start gap-3">
                <div className={`mt-1 ${isSafe ? 'text-green-500' : 'text-red-500'}`}>
                    {isSafe ? <CheckCircle2 size={20} /> : <AlertOctagon size={20} />}
                </div>
                <div>
                    <p className="font-bold text-slate-800 text-sm md:text-base break-all">{url}</p>
                    <p className="text-xs text-slate-500">{date} • Score: {score}/100</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                 <span className={`px-2 py-1 text-xs font-bold rounded-full ${isSafe ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isSafe ? 'ปลอดภัย' : 'อันตราย'}
                </span>
                <button className="text-slate-400 hover:text-blue-600 p-2"><ArrowRight size={18}/></button>
            </div>
        </div>
    )
}