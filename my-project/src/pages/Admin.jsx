import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Trash2,
  Search,
  FileText,
  Edit,
  Plus,
  ShieldAlert,
  Globe,
  Ban,
  ChevronLeft,
  ChevronRight,
  Eye,
  Activity,
  Calendar,
  XCircle,
  ChevronDown,
  MousePointerClick,
  Image as ImageIcon,
} from "lucide-react";

// --- Library กราฟและแผนที่ ---
// เพิ่มการ import Line จาก react-simple-maps
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
// เพิ่มการ import PieChart, Pie, Cell, Legend จาก recharts
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ==========================================
// 🛠️ Helper Functions (แปลงภาษา)
// ==========================================
const getStatusBadge = (status) => {
  switch (status) {
    // User Status
    case "ACTIVE":
      return {
        label: "ใช้งานปกติ",
        className: "bg-green-100 text-green-700 border-green-200",
      };
    case "BANNED":
      return {
        label: "ถูกระงับ",
        className: "bg-red-100 text-red-700 border-red-200",
      };
    // Report Status
    case "PENDING":
      return {
        label: "รอตรวจสอบ",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    case "RESOLVED":
      return {
        label: "ตรวจสอบแล้ว",
        className: "bg-green-100 text-green-700 border-green-200",
      };
    case "REJECTED":
      return {
        label: "ปฏิเสธ",
        className: "bg-slate-100 text-slate-600 border-slate-200",
      };
    // Site Status
    case "SAFE":
      return {
        label: "ปลอดภัย",
        className: "bg-green-100 text-green-700 border-green-200",
      };
    case "DANGEROUS":
      return {
        label: "อันตราย",
        className: "bg-red-100 text-red-700 border-red-200",
      };
    // Knowledge Status
    case "Published":
      return {
        label: "เผยแพร่แล้ว",
        className: "bg-blue-100 text-blue-700 border-blue-200",
      };
    case "Draft":
      return {
        label: "ฉบับร่าง",
        className: "bg-slate-200 text-slate-600 border-slate-300",
      };
    default:
      return { label: status, className: "bg-slate-100 text-slate-600" };
  }
};

const getRoleName = (role) =>
  role === "ADMIN" ? "ผู้ดูแลระบบ" : "สมาชิกทั่วไป";

// ==========================================
// 🛠️ Component: Pagination (ตัวแบ่งหน้า)
// ==========================================
function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}) {
  if (totalItems === 0) return null;
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
      <span className="text-xs text-slate-500 font-medium">
        แสดง {(currentPage - 1) * 5 + 1} ถึง{" "}
        {Math.min(currentPage * 5, totalItems)} จาก {totalItems} รายการ
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1.5 border border-slate-200 rounded-lg hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition bg-white text-slate-500"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-1.5 border border-slate-200 rounded-lg hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition bg-white text-slate-500"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 🚀 Main Component: AdminDashboard
// ==========================================
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "ภาพรวมระบบ",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "users", label: "จัดการผู้ใช้", icon: <Users size={20} /> },
    { id: "reports", label: "รายการแจ้งเบาะแส", icon: <FileText size={20} /> },
    {
      id: "sites",
      label: "จัดการเว็บไซต์",
      icon: <Globe size={20} />,
    },
    { id: "knowledge", label: "คลังความรู้", icon: <BookOpen size={20} /> },
    // Settings ตัดออกแล้ว
  ];

  return (
    
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-20`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl tracking-tight">
              <ShieldAlert size={28} /> PhishWise
            </div>
          ) : (
            <div className="mx-auto text-blue-600">
              <ShieldAlert size={28} />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-slate-400 hover:text-blue-600 transition"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-3 w-full rounded-xl transition-all font-medium ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              <div className="shrink-0">{item.icon}</div>
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium ${!isSidebarOpen && "justify-center"}`}
          >
            <LogOut size={20} />
            {isSidebarOpen && "ออกจากระบบ"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 px-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {menuItems.find((m) => m.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold shadow-sm">
              <Activity size={14} /> ระบบทำงานปกติ
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">
              แอดมิน
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto pb-20">
          {activeTab === "dashboard" && <DashboardOverview />}
          {activeTab === "users" && <UsersSection />}
          {activeTab === "reports" && <ReportsSection />}
          {activeTab === "sites" && <SiteManagementSection />}
          {activeTab === "knowledge" && <KnowledgeSection />}
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 1. 📊 Dashboard Overview
// ==========================================
// ----------------------------------------------------
// 📊 Sub-Component: ภาพรวมระบบ (Dashboard Overview)
// ----------------------------------------------------
function DashboardOverview() {
  const [filterType, setFilterType] = useState("1Y");
  const [selectedYear, setSelectedYear] = useState("2025");
  
  // State สำหรับ Live Map
  const [attacks, setAttacks] = useState([]);

  // --- 1. ข้อมูล Mock Data ---
  const filterOptions = [
    { id: "1D", label: "วันนี้" },
    { id: "1W", label: "สัปดาห์" },
    { id: "1M", label: "เดือน" },
    { id: "1Y", label: "ปี" },
    { id: "ALL", label: "ทั้งหมด" },
  ];

  const chartDatabase = {
    "1D": [
      { name: "00:00", threats: 5 }, { name: "04:00", threats: 2 },
      { name: "08:00", threats: 15 }, { name: "12:00", threats: 45 },
      { name: "16:00", threats: 30 }, { name: "20:00", threats: 20 },
    ],
    "1W": [
      { name: "จ.", threats: 120 }, { name: "อ.", threats: 150 },
      { name: "พ.", threats: 90 }, { name: "พฤ.", threats: 180 },
      { name: "ศ.", threats: 300 }, { name: "ส.", threats: 200 },
      { name: "อา.", threats: 250 },
    ],
    "1M": [
      { name: "สัปดาห์ 1", threats: 800 }, { name: "สัปดาห์ 2", threats: 950 },
      { name: "สัปดาห์ 3", threats: 700 }, { name: "สัปดาห์ 4", threats: 1200 },
    ],
    "1Y": {
      2024: [
        { name: "ม.ค.", threats: 1500 }, { name: "ก.พ.", threats: 1400 },
        { name: "มี.ค.", threats: 1600 }, { name: "เม.ย.", threats: 1300 },
        { name: "พ.ค.", threats: 2000 }, { name: "มิ.ย.", threats: 2100 },
        { name: "ก.ค.", threats: 2200 }, { name: "ส.ค.", threats: 2500 },
        { name: "ก.ย.", threats: 2300 }, { name: "ต.ค.", threats: 2800 },
        { name: "พ.ย.", threats: 3000 }, { name: "ธ.ค.", threats: 3200 },
      ],
      2025: [
        { name: "ม.ค.", threats: 3500 }, { name: "ก.พ.", threats: 3800 },
        { name: "มี.ค.", threats: 4000 }, { name: "เม.ย.", threats: 3900 },
        { name: "พ.ค.", threats: 4500 }, { name: "มิ.ย.", threats: 0 },
      ],
    },
    ALL: [
      { name: "2564", threats: 15000 }, { name: "2565", threats: 35000 },
      { name: "2566", threats: 42000 }, { name: "2567", threats: 55000 },
      { name: "2568", threats: 25000 },
    ],
  };

  const threatTypeData = [
    { name: "Phishing", value: 400, color: "#EF4444" }, 
    { name: "Malware", value: 300, color: "#F59E0B" },  
    { name: "DDoS", value: 300, color: "#8B5CF6" },     
    { name: "Spyware", value: 200, color: "#10B981" },  
  ];

  const topCountries = [
    { name: "United States", count: 1250, percent: 80, flag: "🇺🇸" },
    { name: "China", count: 980, percent: 65, flag: "🇨🇳" },
    { name: "Russia", count: 850, percent: 50, flag: "🇷🇺" },
    { name: "Brazil", count: 600, percent: 35, flag: "🇧🇷" },
    { name: "Thailand", count: 420, percent: 20, flag: "🇹🇭" },
  ];

  // พิกัดสำหรับ Live Map
  const geoCoords = {
    USA: [-95.7129, 37.0902],
    China: [104.1954, 35.8617],
    Russia: [105.3188, 61.5240],
    Brazil: [-51.9253, -14.2350],
    Thailand: [100.9925, 15.8700],
    Australia: [133.7751, -25.2744],
    Germany: [10.4515, 51.1657],
    India: [78.9629, 20.5937],
    Japan: [138.2529, 36.2048],
    UK: [-3.4359, 55.3781],
  };

  // --- 2. Logic & Effects ---

  // คำนวณข้อมูลกราฟ Area Chart
  let currentData =
    filterType === "1Y"
      ? chartDatabase["1Y"][selectedYear] || chartDatabase["1Y"]["2025"]
      : chartDatabase[filterType];
  const totalThreats = currentData.reduce((acc, curr) => acc + curr.threats, 0);

  // Effect: จำลองการโจมตี (Live Attack Simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      const keys = Object.keys(geoCoords);
      const sourceKey = keys[Math.floor(Math.random() * keys.length)];
      let targetKey = keys[Math.floor(Math.random() * keys.length)];
      
      // ป้องกัน Source กับ Target ซ้ำกัน
      while (targetKey === sourceKey) {
        targetKey = keys[Math.floor(Math.random() * keys.length)];
      }

      const newAttack = {
        id: Date.now(),
        from: geoCoords[sourceKey],
        to: geoCoords[targetKey],
        sourceName: sourceKey,
        targetName: targetKey,
      };

      // เก็บไว้แค่ 7 เส้นล่าสุด เพื่อไม่ให้รก
      setAttacks((prev) => [...prev.slice(-6), newAttack]);
    }, 1000); // ความเร็วการยิง (1 วิ)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* CSS Animation สำหรับเส้นเลเซอร์ */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
        .laser-line {
          stroke-dasharray: 10;
          stroke-dashoffset: 100;
          animation: dash 1s linear forwards;
        }
      `}</style>

      {/* =========================================================
          1. STATS CARDS
         ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 rounded-xl text-white shadow-lg bg-blue-500"><MousePointerClick size={24} /></div>
          <div><p className="text-slate-500 text-sm font-medium">การเข้าชมวันนี้</p><h3 className="text-2xl font-bold text-slate-800">12,540</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 rounded-xl text-white shadow-lg bg-red-500"><Ban size={24} /></div>
          <div>
            <p className="text-slate-500 text-sm font-medium">ภัยคุกคาม ({filterType === "1Y" ? `ปี ${selectedYear}` : filterOptions.find((f) => f.id === filterType).label})</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalThreats.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 rounded-xl text-white shadow-lg bg-orange-500"><ShieldAlert size={24} /></div>
          <div><p className="text-slate-500 text-sm font-medium">แจ้งเบาะแสใหม่</p><h3 className="text-2xl font-bold text-slate-800">15</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
          <div className="p-4 rounded-xl text-white shadow-lg bg-emerald-500"><BookOpen size={24} /></div>
          <div><p className="text-slate-500 text-sm font-medium">บทความในคลัง</p><h3 className="text-2xl font-bold text-slate-800">45</h3></div>
        </div>
      </div>

      {/* =========================================================
          2. AREA CHART & LIVE MAP
         ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Area Chart (Left) --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Activity size={20} className="text-red-500" /> แนวโน้มภัยคุกคามทางไซเบอร์
            </h3>
            <div className="flex items-center gap-2">
              {filterType === "1Y" && (
                <div className="relative">
                  <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="appearance-none pl-3 pr-8 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-200">
                    <option value="2025">2568 (2025)</option>
                    <option value="2024">2567 (2024)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
                </div>
              )}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {filterOptions.map((opt) => (
                  <button key={opt.id} onClick={() => setFilterType(opt.id)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${filterType === opt.id ? "bg-white text-red-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentData}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip labelStyle={{ color: "#334155", fontWeight: "bold" }} itemStyle={{ color: "#ef4444" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                <Area type="monotone" dataKey="threats" name="จำนวนภัยคุกคาม" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorThreats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Live Cyber Threat Map (Right - Dark Theme) --- */}
        <div className="bg-[#1e293b] p-6 rounded-2xl shadow-lg border border-slate-700 overflow-hidden flex flex-col text-white">
            <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe size={20} className="text-blue-400 animate-pulse" /> Live Threat Map
                </h3>
                <p className="text-slate-400 text-xs">ระบบเฝ้าระวังแบบ Real-time</p>
            </div>
            <div className="flex gap-2 text-xs">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> Attack</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div> Target</div>
            </div>
            </div>

            <div className="flex-1 w-full bg-[#0f172a] rounded-xl border border-slate-700 relative overflow-hidden">
            <ComposableMap projectionConfig={{ scale: 170, rotation: [-10, 0, 0] }} className="w-full h-full">
                {/* แผนที่ฐาน (สีมืด) */}
                <Geographies geography={geoUrl}>
                {({ geographies }) =>
                    geographies.map((geo) => (
                    <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#334155"
                        stroke="#1e293b"
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

                {/* เส้นเลเซอร์ (Vectors) */}
                {attacks.map((attack) => (
                <Line
                    key={attack.id}
                    from={attack.from}
                    to={attack.to}
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeLinecap="round"
                    className="laser-line opacity-60"
                />
                ))}

                {/* จุด Marker */}
                {attacks.map((attack) => (
                <g key={`marker-${attack.id}`}>
                    <Marker coordinates={attack.from}>
                        <circle r={2} fill="#ef4444" />
                    </Marker>
                    <Marker coordinates={attack.to}>
                        <circle r={8} fill="#3b82f6" fillOpacity="0.3" className="animate-ping" />
                        <circle r={3} fill="#3b82f6" stroke="#fff" strokeWidth={1} />
                        {/* Tooltip ชื่อประเทศ */}
                        <text textAnchor="middle" y={-10} className="fill-white text-[8px] font-bold opacity-80" style={{ textShadow: "0px 1px 2px black" }}>
                            {attack.targetName}
                        </text>
                    </Marker>
                </g>
                ))}
            </ComposableMap>

            {/* ✅ Ticker Log (แถบวิ่งด้านล่าง) - ไม่บังแผนที่ */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md py-2 px-4 border-t border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-300 tracking-wider uppercase">Live Feed</span>
                </div>
                
                <div className="flex gap-4 overflow-hidden mask-linear-fade">
                    {attacks.slice(-3).reverse().map((att) => (
                    <div key={att.id} className="flex items-center gap-1 text-[10px] animate-fade-in-right">
                        <span className="text-red-400 font-mono">{att.sourceName}</span>
                        <span className="text-slate-500">➜</span>
                        <span className="text-blue-400 font-mono">{att.targetName}</span>
                    </div>
                    ))}
                </div>
            </div>

            </div>
        </div>
      </div>

      {/* =========================================================
          3. PIE CHART & TOP COUNTRIES
         ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldAlert size={20} className="text-orange-500" /> สัดส่วนประเภทภัยคุกคาม
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={threatTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {threatTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Countries List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Globe size={20} className="text-blue-500" /> 5 อันดับประเทศต้นทาง
          </h3>
          <div className="space-y-4">
            {topCountries.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-lg transition">
                <span className="text-2xl shadow-sm rounded-full">{item.flag}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-slate-700">{item.name}</span>
                    <span className="text-slate-500 font-mono font-bold">{item.count.toLocaleString()} ครั้ง</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.percent}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. 👥 Users Section
// ==========================================
function UsersSection() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "สมชาย ใจดี",
      email: "somchai@gmail.com",
      role: "MEMBER",
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "ผู้ดูแลระบบ",
      email: "admin@phishwise.com",
      role: "ADMIN",
      status: "ACTIVE",
    },
    {
      id: 3,
      name: "แฮกเกอร์คุง",
      email: "hack@darkweb.com",
      role: "MEMBER",
      status: "BANNED",
    },
    {
      id: 4,
      name: "ลิซ่า แบล็กพิงก์",
      email: "lisa@yg.com",
      role: "MEMBER",
      status: "ACTIVE",
    },
    {
      id: 5,
      name: "จอห์น โด",
      email: "john@test.com",
      role: "MEMBER",
      status: "ACTIVE",
    },
    {
      id: 6,
      name: "เจน สมิธ",
      email: "jane@test.com",
      role: "MEMBER",
      status: "ACTIVE",
    },
  ]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const toggleBan = (id) =>
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "ACTIVE" ? "BANNED" : "ACTIVE" }
          : u,
      ),
    );
  const deleteUser = (id) =>
    window.confirm("ยืนยันการลบผู้ใช้รายนี้?") &&
    setUsers(users.filter((u) => u.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 w-full max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ค้นหาชื่อหรืออีเมล..."
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow-sm">
            ค้นหา
          </button>
        </div>
      </div>

<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
            <tr>
              {/* ✅ 1. เพิ่มหัวตาราง # */}
              <th className="p-4 w-16 text-center font-bold">#</th>
              <th className="p-4 font-bold">ชื่อผู้ใช้</th>
              <th className="p-4 font-bold">สถานะ</th>
              <th className="p-4 font-bold">บทบาท</th>
              <th className="p-4 font-bold text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {/* ✅ 2. เพิ่ม index ใน .map */}
            {paginatedUsers.map((u, index) => {
              const statusInfo = getStatusBadge(u.status);
              
              // ✅ 3. สูตรคำนวณลำดับ
              const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;

              return (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  {/* ✅ 4. เพิ่ม Cell แสดงตัวเลขลำดับ */}
                  <td className="p-4 text-center text-slate-400 font-mono">
                    {rowNumber}
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-slate-800">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{getRoleName(u.role)}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => toggleBan(u.id)}
                      className={`p-2 rounded-lg transition border ${u.status === "ACTIVE" ? "bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100 border-green-100"}`}
                    >
                      {u.status === "ACTIVE" ? (
                        <Ban size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg border border-red-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredUsers.length / rowsPerPage)}
          onPageChange={setCurrentPage}
          totalItems={filteredUsers.length}
        />
      </div>
    </div>
  );
}

// ==========================================
// 3. 🚨 Reports Section
// ==========================================
function ReportsSection() {
  const [reports, setReports] = useState([
    {
      id: 1,
      url: "http://scb-verify.com",
      type: "Phishing",
      reporter: "สมชาย",
      status: "PENDING",
    },
    {
      id: 2,
      url: "http://free-money.net",
      type: "Scam",
      reporter: "ลิซ่า",
      status: "RESOLVED",
    },
    {
      id: 3,
      url: "http://virus-dl.com",
      type: "Malware",
      reporter: "จอห์น",
      status: "REJECTED",
    },
    {
      id: 4,
      url: "http://fake-login.com",
      type: "Phishing",
      reporter: "สมาชิก 1",
      status: "PENDING",
    },
    {
      id: 5,
      url: "http://win-iphone.net",
      type: "Scam",
      reporter: "สมาชิก 2",
      status: "PENDING",
    },
    {
      id: 6,
      url: "http://bet-online.com",
      type: "Gambling",
      reporter: "สมาชิก 3",
      status: "RESOLVED",
    },
  ]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredReports = reports.filter(
    (r) =>
      r.url.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter.toLowerCase().includes(search.toLowerCase()),
  );
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const updateStatus = (id, newStatus) =>
    setReports(
      reports.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );

  // แปลงประเภทภัยคุกคาม
  const getReportType = (type) => {
    const types = {
      Phishing: "ฟิชชิ่ง/เว็บปลอม",
      Scam: "หลอกลวง",
      Malware: "มัลแวร์",
      Gambling: "การพนัน",
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ShieldAlert className="text-orange-500" /> รายการแจ้งเบาะแสล่าสุด
        </h3>
        <div className="flex gap-2 w-full max-w-sm">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ค้นหา URL..."
              className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
          </div>
          <button className="bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition text-sm">
            ค้นหา
          </button>
        </div>
      </div>

<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
            <tr>
              {/* ✅ 1. เพิ่มหัวตาราง # */}
              <th className="p-4 w-16 text-center">#</th>
              <th className="p-4">URL</th>
              <th className="p-4">ประเภท</th>
              <th className="p-4">ผู้แจ้ง</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4 text-right">ตรวจสอบ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {/* ✅ 2. เพิ่ม index ใน .map */}
            {paginatedReports.map((r, index) => {
              const statusInfo = getStatusBadge(r.status);
              
              // ✅ 3. สูตรคำนวณลำดับ
              const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;

              return (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  {/* ✅ 4. เพิ่ม Cell แสดงตัวเลขลำดับ */}
                  <td className="p-4 text-center text-slate-400 font-mono">
                    {rowNumber}
                  </td>

                  <td className="p-4 font-bold text-blue-600 break-all">
                    {r.url}
                  </td>
                  <td className="p-4 text-slate-600">
                    {getReportType(r.type)}
                  </td>
                  <td className="p-4 text-slate-500">{r.reporter}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {r.status === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => updateStatus(r.id, "RESOLVED")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 shadow-sm transition"
                        >
                          <CheckCircle size={14} /> ยืนยัน
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, "REJECTED")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs hover:bg-slate-50 transition"
                        >
                          <XCircle size={14} /> ปฏิเสธ
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        ดำเนินการแล้ว
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredReports.length / rowsPerPage)}
          onPageChange={setCurrentPage}
          totalItems={filteredReports.length}
        />
      </div>
    </div>
  );
}

// ==========================================
// 4. 🔥 Site Management
// ==========================================
function SiteManagementSection() {
  // 1. Mock Data
  const [sites, setSites] = useState([
    { id: 1, url: "example-phish.com", status: "DANGEROUS", type: "Phishing" },
    { id: 2, url: "google.com", status: "SAFE", type: "Official" },
    { id: 3, url: "malware-load.net", status: "DANGEROUS", type: "Malware" },
    { id: 4, url: "scam-shop.online", status: "DANGEROUS", type: "Scam" },
    { id: 5, url: "facebook.com", status: "SAFE", type: "Official" },
  ]);

  // 2. States
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // ✅ State สำหรับควบคุม Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ✅ State สำหรับฟอร์ม
  const [newSiteUrl, setNewSiteUrl] = useState("");
  const [newSiteType, setNewSiteType] = useState("Phishing");
  const [newSiteStatus, setNewSiteStatus] = useState("DANGEROUS");

  // 3. Handlers
  const handleAddSite = () => {
    if (!newSiteUrl.trim()) return;

    // บันทึกข้อมูล
    setSites([
      {
        id: Date.now(),
        url: newSiteUrl,
        status: newSiteStatus,
        type: newSiteType,
      },
      ...sites,
    ]);

    // Reset & Close Modal
    setNewSiteUrl("");
    setNewSiteType("Phishing");
    setNewSiteStatus("DANGEROUS");
    setIsAddModalOpen(false); // ปิด Modal
  };

  const handleDeleteSite = (id) => {
    if (window.confirm("ยืนยันการลบโดเมนนี้?")) {
      setSites(sites.filter((s) => s.id !== id));
    }
  };

  const getStatusBadgeLocal = (status) => {
    return status === "SAFE"
      ? { label: "ปลอดภัย", className: "bg-green-100 text-green-700 border-green-200" }
      : { label: "อันตราย", className: "bg-red-100 text-red-700 border-red-200" };
  };

  // 4. Logic การกรอง
  const filteredSites = sites.filter((s) => {
    const matchesFilter = filter === "ALL" || s.status === filter;
    const matchesSearch = s.url.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const paginatedSites = filteredSites.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">จัดการ Blacklist / Whitelist</h1>
        
        {/* ✅ ปุ่มเปิด Modal (ย้ายมาขวาบน ดูดีกว่า) */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm transition"
        >
          <Plus size={20} /> เพิ่มเว็บไซต์
        </button>
      </div>

      {/* --- Tools Bar (Filter & Search) --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
          {["ALL", "DANGEROUS", "SAFE"].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-bold transition ${
                filter === f
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f === "ALL" ? "ทั้งหมด" : f === "DANGEROUS" ? "อันตราย" : "ปลอดภัย"}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหา URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
            <tr>
              <th className="p-4 w-16 text-center">#</th>
              <th className="p-4">URL</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4">ประเภท</th>
              <th className="p-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {paginatedSites.map((site, index) => {
              const statusInfo = getStatusBadgeLocal(site.status);
              const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;

              return (
                <tr key={site.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-center text-slate-400 font-mono">{rowNumber}</td>
                  <td className="p-4 font-bold text-slate-800">{site.url}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{site.type}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteSite(site.id)}
                      className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredSites.length / rowsPerPage)}
          onPageChange={setCurrentPage}
          totalItems={filteredSites.length}
        />
      </div>

      {/* =========================================================
          🟢 MODAL ZONE : ส่วนหน้าต่างเด้งเพิ่มข้อมูล
         ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Globe size={20} className="text-blue-600"/> เพิ่มเว็บไซต์ใหม่
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">URL เว็บไซต์</label>
                <input
                  type="text"
                  placeholder="เช่น example-phish.com"
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              {/* Type Select */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">ประเภทภัยคุกคาม</label>
                <select
                  value={newSiteType}
                  onChange={(e) => setNewSiteType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Phishing">Phishing (เว็บปลอม)</option>
                  <option value="Malware">Malware (มัลแวร์)</option>
                  <option value="Scam">Scam (หลอกลวง)</option>
                  <option value="Gambling">Gambling (พนัน)</option>
                  <option value="Official">Official (เว็บทางการ)</option>
                </select>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">ระดับความเสี่ยง</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setNewSiteStatus("DANGEROUS")}
                        className={`flex-1 py-2 rounded-lg border font-bold text-sm transition ${
                            newSiteStatus === "DANGEROUS" 
                            ? "bg-red-50 border-red-500 text-red-600" 
                            : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                        }`}
                    >
                        อันตราย
                    </button>
                    <button
                        onClick={() => setNewSiteStatus("SAFE")}
                        className={`flex-1 py-2 rounded-lg border font-bold text-sm transition ${
                            newSiteStatus === "SAFE" 
                            ? "bg-green-50 border-green-500 text-green-600" 
                            : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                        }`}
                    >
                        ปลอดภัย
                    </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddSite}
                disabled={!newSiteUrl.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. 📚 Knowledge Section (อัปเดตเพิ่มหมวดหมู่ Malware)
// ==========================================
function KnowledgeSection() {
  // ✅ 1. เพิ่ม field 'image' ในข้อมูลตัวอย่าง
  const [knowledgeList, setKnowledgeList] = useState([
    {
      id: 1,
      title: "วิธีสังเกต Phishing Email",
      category: "Phishing",
      views: 1200,
      status: "Published",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 2,
      title: "รหัสผ่านที่ดีควรเป็นอย่างไร",
      category: "Security",
      views: 850,
      status: "Published",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 3,
      title: "ระวัง! SMS หลอกลวง",
      category: "Scams",
      views: 500,
      status: "Draft",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 4,
      title: "การป้องกัน Ransomware",
      category: "Malware",
      views: 300,
      status: "Published",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 5,
      title: "Social Engineering คืออะไร",
      category: "Phishing",
      views: 1500,
      status: "Published",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 6,
      title: "ความปลอดภัยของ WiFi สาธารณะ",
      category: "Security",
      views: 600,
      status: "Draft",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=200"
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // ✅ 2. เพิ่ม image: "" ใน state ของ Form
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: "Published",
    image: "", 
  });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Published":
        return { label: "เผยแพร่แล้ว", className: "bg-blue-100 text-blue-700 border-blue-200" };
      case "Draft":
        return { label: "ฉบับร่าง", className: "bg-slate-200 text-slate-600 border-slate-300" };
      default:
        return { label: status, className: "bg-slate-100 text-slate-600" };
    }
  };

  const filteredList = knowledgeList.filter((k) =>
    k.title.toLowerCase().includes(search.toLowerCase()),
  );
  const paginatedList = filteredList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(
      // ✅ เพิ่ม image ในการ reset หรือ load ข้อมูล
      item ? { ...item } : { title: "", category: "", status: "Published", image: "" },
    );
    setIsModalOpen(true);
  };

  const handleSave = () => {
    // ถ้าไม่ได้ใส่รูป ให้ใส่รูป Default
    const finalData = {
        ...formData,
        image: formData.image || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200"
    };

    if (editingItem)
      setKnowledgeList(
        knowledgeList.map((item) =>
          item.id === editingItem.id ? { ...item, ...finalData } : item,
        ),
      );
    else
      setKnowledgeList([
        ...knowledgeList,
        { id: Date.now(), ...finalData, views: 0 },
      ]);
    setIsModalOpen(false);
  };

  const handleDelete = (id) =>
    window.confirm("ยืนยันการลบบทความนี้?") &&
    setKnowledgeList(knowledgeList.filter((k) => k.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section (เหมือนเดิม) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-slate-800">คลังความรู้</h3>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="ค้นหาบทความ..."
              className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
          <button className="bg-slate-800 text-white px-3 py-2 rounded-xl hover:bg-slate-900 transition text-sm">
            ค้นหา
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-md transition whitespace-nowrap"
          >
            <Plus size={18} /> เขียนใหม่
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase">
            <tr>
              <th className="p-4 w-16 text-center">#</th>
              <th className="p-4">หัวข้อ</th>
              <th className="p-4">หมวดหมู่</th>
              <th className="p-4">ยอดวิว</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {paginatedList.map((item, index) => {
              const statusInfo = getStatusBadge(item.status);
              const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;

              return (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 text-center text-slate-400 font-mono">
                    {rowNumber}
                  </td>
                  
                  {/* ✅ 3. ปรับ Column หัวข้อให้แสดงรูปภาพคู่กัน */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            {item.image ? (
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <ImageIcon size={16} />
                                </div>
                            )}
                        </div>
                        <span className="font-bold text-slate-800 line-clamp-1">{item.title}</span>
                    </div>
                  </td>

                  <td className="p-4 text-slate-600">{item.category}</td>
                  <td className="p-4 text-slate-500 flex items-center gap-1">
                    <Eye size={14} /> {item.views.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => openModal(item)}
                      className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 border border-orange-100 transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Pagination component (สมมติว่ามีอยู่แล้ว) */}
        {/* <TablePagination ... /> */}
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {editingItem ? "แก้ไขบทความ" : "สร้างบทความใหม่"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-red-500"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              
              {/* ✅ 4. เพิ่มส่วนจัดการรูปภาพใน Modal */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">รูปภาพปก</label>
                
                {/* Preview Image Box */}
                <div className="w-full h-40 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden mb-3 relative group">
                    {formData.image ? (
                        <>
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            {/* ปุ่มกดลบรูป (Optional) */}
                            <button 
                                onClick={() => setFormData({...formData, image: ""})}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <div className="text-slate-400 text-center">
                            <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                            <span className="text-xs">แสดงตัวอย่างรูปภาพ</span>
                        </div>
                    )}
                </div>

                {/* Input URL */}
                <input
                  type="text"
                  placeholder="วางลิงก์รูปภาพ (URL) ที่นี่..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-slate-400 mt-1">
                    *ในระบบจริงจะใช้ปุ่ม Upload ไฟล์ (ตอนนี้ใช้ URL แทน)
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  หัวข้อบทความ
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                    หมวดหมู่
                    </label>
                    <select
                    value={formData.category}
                    onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    <option value="">เลือกหมวดหมู่...</option>
                    <option value="Phishing">Phishing</option>
                    <option value="Scams">Scams</option>
                    <option value="Malware">Malware</option>
                    <option value="Security">Security</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                    สถานะ
                    </label>
                    <select
                    value={formData.status}
                    onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    <option value="Published">เผยแพร่</option>
                    <option value="Draft">ฉบับร่าง</option>
                    </select>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg mt-4"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
