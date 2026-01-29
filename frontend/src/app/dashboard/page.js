'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  History, AlertOctagon, CheckCircle2, Globe, Activity, ArrowRight, ShieldCheck, AlertTriangle 
} from 'lucide-react';

// Library กราฟ
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
  
// Library แผนที่
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function MemberDashboard() {
  
  // State เลือกช่วงเวลา (Default: 7 วัน)
  const [timeRange, setTimeRange] = useState('7d');

  // ฐานข้อมูลจำลอง (Mock Data)
  const userStatsDatabase = {
    '1d': {
      graph: [ 
        { name: '00:00', safe: 1, threat: 0 }, { name: '06:00', safe: 0, threat: 0 },
        { name: '12:00', safe: 4, threat: 1 }, { name: '18:00', safe: 5, threat: 1 },
      ]
    },
    '3d': {
      graph: [ 
        { name: '27 ม.ค.', safe: 15, threat: 1 },
        { name: '28 ม.ค.', safe: 12, threat: 3 },
        { name: 'วันนี้', safe: 13, threat: 1 },
      ]
    },
    '7d': {
      graph: [ 
        { name: 'จ.', safe: 10, threat: 1 }, { name: 'อ.', safe: 20, threat: 2 },
        { name: 'พ.', safe: 15, threat: 0 }, { name: 'พฤ.', safe: 25, threat: 3 },
        { name: 'ศ.', safe: 18, threat: 1 }, { name: 'ส.', safe: 10, threat: 2 },
        { name: 'อา.', safe: 20, threat: 1 },
      ]
    },
    '1m': {
      graph: [ 
        { name: 'Week 1', safe: 100, threat: 5 }, { name: 'Week 2', safe: 120, threat: 8 },
        { name: 'Week 3', safe: 90, threat: 12 }, { name: 'Week 4', safe: 110, threat: 5 },
      ]
    },
    '1y': {
      graph: [ 
        { name: 'ม.ค.', safe: 400, threat: 20 }, { name: 'เม.ย.', safe: 450, threat: 15 },
        { name: 'ก.ค.', safe: 500, threat: 50 }, { name: 'ต.ค.', safe: 600, threat: 30 },
      ]
    },
    'all': { // ✅ เพิ่มข้อมูลกราฟสำหรับ "ทั้งหมด"
      summary: { total: 12500, safe: 11800, threat: 700 }, 
      graph: [
        { name: '2023', safe: 3000, threat: 200 },
        { name: '2024', safe: 5000, threat: 300 },
        { name: '2025', safe: 3800, threat: 200 },
      ]
    }
  };

  // 1. ข้อมูลสำหรับการ์ด (Fixed ที่ All Time)
  const allTimeStats = userStatsDatabase['all'].summary;
  const safePercent = ((allTimeStats.safe / allTimeStats.total) * 100).toFixed(1);
  const threatPercent = ((allTimeStats.threat / allTimeStats.total) * 100).toFixed(1);

  // 2. ข้อมูลสำหรับกราฟ (Dynamic)
  const currentGraphData = userStatsDatabase[timeRange]?.graph || userStatsDatabase['7d'].graph;

  // ข้อมูลแผนที่
  const threatsMap = [
    { name: "USA", coordinates: [-100, 40], delay: 0 },
    { name: "Russia", coordinates: [100, 60], delay: 0.5 },
    { name: "China", coordinates: [110, 35], delay: 1.5 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
       
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Member Dashboard 👋</h1>
                <p className="text-slate-500">ยินดีต้อนรับกลับ, คุณ <span className="text-slate-900 font-semibold">Somchai</span></p>
            </div>
            <Link href="/" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-200 transition flex items-center gap-2">
                <Activity size={18} /> สแกนลิงก์ใหม่
            </Link>
        </div>

        {/* Cards Overview (All Time Data) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
                label="ลิงก์ที่ตรวจสอบแล้ว (ทั้งหมด)"
                value={allTimeStats.total.toLocaleString()} 
                sub="ตั้งแต่เริ่มใช้งาน" 
                icon={<Globe size={24} />} 
                color="text-blue-600 bg-blue-50" 
            />
            <StatCard 
                label="พบเว็บปลอดภัย" 
                value={allTimeStats.safe.toLocaleString()} 
                sub={`${safePercent}% ของทั้งหมด`} 
                icon={<ShieldCheck size={24} />} 
                color="text-green-600 bg-green-50" 
            />
            <StatCard 
                label="พบเว็บอันตราย" 
                value={allTimeStats.threat.toLocaleString()} 
                sub={`${threatPercent}% ของทั้งหมด`} 
                icon={<AlertTriangle size={24} />} 
                color="text-red-600 bg-red-50" 
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* กราฟสถิติ + ปุ่มเลือกเวลา */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                            <Activity className="text-blue-500" size={20}/> 
                            สถิติการใช้งาน
                        </h3>
                        <p className="text-sm text-slate-400">แสดงข้อมูลในช่วง: {getRangeLabel(timeRange)}</p>
                    </div>

                    <div className="bg-slate-100 p-1 rounded-lg flex flex-wrap gap-1">
                        {[
                            { label: '1วัน', value: '1d' },
                            { label: '3วัน', value: '3d' },
                            { label: '7วัน', value: '7d' },
                            { label: '1เดือน', value: '1m' },
                            { label: '1ปี', value: '1y' },
                            { label: 'ทั้งหมด', value: 'all' }, // ✅ เพิ่มปุ่มทั้งหมดตรงนี้
                        ].map((btn) => (
                            <button
                                key={btn.value}
                                onClick={() => setTimeRange(btn.value)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                                    timeRange === btn.value 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="h-[300px] w-full mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={currentGraphData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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

            {/* Global Threat Map */}
            <div className="bg-[#0f172a] p-6 rounded-2xl shadow-lg border border-slate-800 text-white relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Globe className="text-blue-400" size={20}/> Live Threat Map
                        </h3>
                        <p className="text-slate-400 text-sm">จุดเสี่ยงที่พบทั่วโลก (Global Data)</p>
                    </div>
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </div>

                <div className="flex-1 w-full h-full -ml-4 mt-4">
                    <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
                        <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#1e293b"
                                stroke="#334155"
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "#334155", outline: "none" },
                                    pressed: { outline: "none" },
                                }}
                            />
                            ))
                        }
                        </Geographies>
                        {threatsMap.map(({ name, coordinates, delay }) => (
                            <Marker key={name} coordinates={coordinates}>
                                <circle r={4} fill="#ef4444" stroke="#fff" strokeWidth={1} className="animate-ping opacity-75" style={{ animationDuration: '2s', animationDelay: `${delay}s` }} />
                                <circle r={3} fill="#ef4444" />
                            </Marker>
                        ))}
                    </ComposableMap>
                </div>
            </div>

        </div>

        {/* ประวัติการตรวจสอบล่าสุด */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-slate-900">ประวัติการตรวจสอบล่าสุดของคุณ</h3>
                 <Link href="#" className="text-sm text-blue-600 font-bold hover:underline">ดูประวัติทั้งหมด</Link>
             </div>
             <div className="divide-y divide-slate-100">
                <HistoryItem url="http://example-bank-login.com" status="danger" date="เมื่อสักครู่" score={15} />
                <HistoryItem url="https://shopee.co.th" status="safe" date="2 ชั่วโมงที่แล้ว" score={98} />
                <HistoryItem url="https://facebook-secure-login.xy" status="danger" date="เมื่อวาน" score={5} />
             </div>
        </div>

      </main>
    </div>
  );
}

// Helper Function
function getRangeLabel(range) {
    const labels = {
        '1d': '24 ชั่วโมงล่าสุด',
        '3d': '3 วันล่าสุด',
        '7d': '7 วันล่าสุด',
        '1m': '1 เดือนล่าสุด',
        '1y': '1 ปีล่าสุด',
        'all': 'ทั้งหมดตั้งแต่เริ่มใช้งาน' // ✅ Label สำหรับ all
    };
    return labels[range] || range;
}

// Components ย่อย
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