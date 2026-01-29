'use client';
import { useState } from 'react';
import Modal from '@/components/Modal'; 
import { 
  LayoutDashboard, BellRing, Users, Database, BookOpen, LogOut, Menu, X,
  CheckCircle, Trash2, Search, AlertTriangle, FileText, Edit, Plus, Info,
  TrendingUp, ShieldAlert, Globe
} from 'lucide-react';

// --- Library กราฟและแผนที่ ---
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- 1. Database จำลอง (State) ---
  // ข้อมูล Users
  const [users, setUsers] = useState([
    { id: 1, name: "Somchai Jaidee", email: "somchai@test.com", role: "Member", status: "Active", joinDate: "12 ม.ค. 67" },
    { id: 2, name: "Admin Boss", email: "admin@test.com", role: "Admin", status: "Active", joinDate: "10 ม.ค. 67" },
    { id: 3, name: "Hacker Kung", email: "hack@dark.net", role: "Member", status: "Banned", joinDate: "13 ม.ค. 67" },
  ]);

  // ข้อมูล Reports
  const [reports, setReports] = useState([
    { id: 101, url: "http://free-money-now.xyz", reporter: "user1", type: "Phishing", status: "Pending" },
    { id: 102, url: "https://fake-bank-login.com", reporter: "user2", type: "Malware", status: "Pending" },
    { id: 103, url: "https://google.com", reporter: "user3", type: "Scam", status: "Safe" },
  ]);

  // ข้อมูล Blacklist
  const [blacklist, setBlacklist] = useState([
    { id: 1, url: "http://phishing-site.xyz", level: "Critical", date: "24 ม.ค. 67" }
  ]);

  // --- 2. Action Handlers (ฟังก์ชันจัดการข้อมูล) ---
  // Users Handlers
  const handleAddUser = (newUser) => setUsers([...users, { ...newUser, id: Date.now(), joinDate: 'วันนี้' }]);
  const handleEditUser = (updatedUser) => setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  const handleDeleteUser = (id) => setUsers(users.filter(u => u.id !== id));

  // Report Handlers
  const handleApproveReport = (report) => {
    setReports(reports.map(r => r.id === report.id ? { ...r, status: 'Banned' } : r));
    setBlacklist([...blacklist, { id: Date.now(), url: report.url, level: 'High', date: 'วันนี้' }]); // Auto add to blacklist
  };
  const handleRejectReport = (id) => setReports(reports.filter(r => r.id !== id));

  // Blacklist Handlers
  const handleAddBlacklist = (item) => setBlacklist([...blacklist, { ...item, id: Date.now(), date: 'วันนี้' }]);
  const handleDeleteBlacklist = (id) => setBlacklist(blacklist.filter(b => b.id !== id));


  // --- Modal Config ---
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', content: null, type: 'info', onConfirm: null });
  const openModal = (config) => setModalConfig({ ...config, isOpen: true });
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));
  const handleConfirm = () => { if (modalConfig.onConfirm) modalConfig.onConfirm(); closeModal(); };


  // --- Render Content Switcher ---
  const renderContent = () => {
    const commonProps = { openModal };
    switch (activeTab) {
        case 'dashboard': 
            return <DashboardStats users={users} reports={reports} blacklist={blacklist} />;
        case 'users': 
            return <UserManagement users={users} onAdd={handleAddUser} onEdit={handleEditUser} onDelete={handleDeleteUser} {...commonProps} />;
        case 'reports': 
            return <ReportManagement reports={reports} onApprove={handleApproveReport} onReject={handleRejectReport} {...commonProps} />;
        case 'blacklist': 
            return <BlacklistManagement blacklist={blacklist} onAdd={handleAddBlacklist} onDelete={handleDeleteBlacklist} {...commonProps} />;
        case 'content': 
            return <ContentManagement {...commonProps} />;
        default: return <DashboardStats />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-[#0f172a] text-slate-300 flex-col shrink-0 transition-all duration-300">
        <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-64 bg-[#0f172a] text-slate-300 flex flex-col h-full shadow-2xl animate-in slide-in-from-left">
            <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-1 text-slate-400"><X size={20} /></button>
            <SidebarContent activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0">
            <div className="font-bold text-slate-900">PhishWise Admin</div>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600"><Menu size={24} /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {renderContent()}
        </div>
      </main>

      {/* Global Modal */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        footer={
           modalConfig.onConfirm ? (
            <>
                <button onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">ยกเลิก</button>
                <button onClick={handleConfirm} className={`px-4 py-2 text-white rounded-lg font-medium transition shadow-sm ${modalConfig.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>ยืนยัน</button>
            </>
           ) : (
            <button onClick={closeModal} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium transition">ปิดหน้าต่าง</button>
           )
        }
      >
        <div className="flex flex-col gap-4">
             <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${modalConfig.type === 'danger' ? 'bg-red-100 text-red-600' : modalConfig.type === 'confirm' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                {modalConfig.type === 'danger' ? <Trash2 size={24} /> : modalConfig.type === 'confirm' ? <CheckCircle size={24} /> : <Info size={24} />}
             </div>
            <div className="text-center">{modalConfig.content}</div>
        </div>
      </Modal>

    </div>
  );
}

// ----------------------------------------------------------------------
// 📊 1. DASHBOARD STATS (มี Map & Graph)
// ----------------------------------------------------------------------
function DashboardStats({ users = [], reports = [], blacklist = [] }) {
    // ข้อมูลกราฟจำลอง
    const chartData = [
        { name: 'จ.', attack: 4, report: 2 },
        { name: 'อ.', attack: 7, report: 5 },
        { name: 'พ.', attack: 5, report: 3 },
        { name: 'พฤ.', attack: 12, report: 8 },
        { name: 'ศ.', attack: 9, report: 6 },
        { name: 'ส.', attack: 15, report: 10 },
        { name: 'อา.', attack: 10, report: 7 },
    ];

    // ข้อมูลจุดบนแผนที่ (Mock)
    const threatMarkers = [
        { name: "USA", coordinates: [-100, 40] },
        { name: "China", coordinates: [105, 35] },
        { name: "Russia", coordinates: [100, 60] },
        { name: "Brazil", coordinates: [-55, -10] },
        { name: "Nigeria", coordinates: [8, 10] },
    ];

    return (
        <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">ภาพรวมระบบ (System Overview)</h1>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold animate-pulse">● System Online</span>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatBox title="ผู้ใช้งานทั้งหมด" value={users.length} icon={<Users size={24}/>} color="bg-blue-600" />
                <StatBox title="รายงานรอตรวจสอบ" value={reports.filter(r => r.status === 'Pending').length} icon={<BellRing size={24}/>} color="bg-orange-500" />
                <StatBox title="Websites Blocked" value={blacklist.length} icon={<ShieldAlert size={24}/>} color="bg-red-600" />
                <StatBox title="Traffic วันนี้" value="12.5k" icon={<TrendingUp size={24}/>} color="bg-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Threat Map 🌍 (Dark Theme ตามรูป) */}
                <div className="lg:col-span-2 bg-[#1e293b] rounded-xl shadow-lg border border-slate-700 p-1 relative overflow-hidden group min-h-[400px]">
                    <div className="absolute top-4 left-4 z-10">
                        <h3 className="text-white font-bold flex items-center gap-2"><Globe size={18} className="text-blue-400"/> Live Threat Map</h3>
                        <p className="text-slate-400 text-xs">แหล่งที่มาของการโจมตีล่าสุด</p>
                    </div>
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                         <span className="text-red-400 text-xs font-bold">LIVE</span>
                    </div>
                    
                    <ComposableMap projectionConfig={{ scale: 160 }} style={{ width: "100%", height: "100%" }}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) => geographies.map((geo) => (
                                <Geography key={geo.rsmKey} geography={geo} fill="#334155" stroke="#1e293b" strokeWidth={0.5} style={{ default: { outline: "none" }, hover: { fill: "#475569", outline: "none" }, pressed: { outline: "none" } }} />
                            ))}
                        </Geographies>
                        {threatMarkers.map(({ name, coordinates }, i) => (
                            <Marker key={i} coordinates={coordinates}>
                                <circle r={4} fill="#ef4444" stroke="#fff" strokeWidth={1} className="animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                                <circle r={3} fill="#ef4444" />
                            </Marker>
                        ))}
                    </ComposableMap>
                </div>

                {/* Graph 📈 */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-blue-600"/> สถิติการโจมตี (7 วัน)</h3>
                    <div className="flex-1 w-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAttack" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}/>
                                <Area type="monotone" dataKey="attack" stroke="#ef4444" fillOpacity={1} fill="url(#colorAttack)" strokeWidth={2} />
                                <Area type="monotone" dataKey="report" stroke="#3b82f6" fillOpacity={0} strokeWidth={2} strokeDasharray="3 3"/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ title, value, icon, color }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-medium uppercase mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg text-white shadow-lg shadow-opacity-20 ${color}`}>{icon}</div>
        </div>
    )
}

// ----------------------------------------------------------------------
// 👥 2. USER MANAGEMENT (Add/Edit/Delete)
// ----------------------------------------------------------------------
function UserManagement({ users, onAdd, onEdit, onDelete, openModal }) {
    // ฟอร์มเพิ่ม/แก้ไข (Component ย่อยภายใน)
    const UserForm = ({ initialData, onSave }) => {
        const [formData, setFormData] = useState(initialData || { name: '', email: '', role: 'Member', status: 'Active' });
        return (
            <div className="flex flex-col gap-3 text-left">
                <input type="text" placeholder="ชื่อ-นามสกุล" className="border p-2 rounded" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                <input type="email" placeholder="อีเมล" className="border p-2 rounded" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
                <select className="border p-2 rounded" value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})}>
                    <option value="Member">Member</option><option value="Admin">Admin</option>
                </select>
                <div className="flex justify-end pt-2">
                    <button onClick={() => onSave(formData)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">บันทึกข้อมูล</button>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900">จัดการสมาชิก ({users.length})</h1>
                <button onClick={() => openModal({
                    title: 'เพิ่มสมาชิกใหม่',
                    content: <UserForm onSave={(data) => { onAdd(data); document.querySelector('.modal-close-btn')?.click(); }} />, // Hacky way to close, better handled via context
                    type: 'info'
                })} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm"><Plus size={18}/> เพิ่มสมาชิก</button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs text-slate-500 font-bold">
                        <tr><th className="px-6 py-4">ชื่อ</th><th className="px-6 py-4">อีเมล</th><th className="px-6 py-4">สถานะ</th><th className="px-6 py-4 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium">{u.name} <span className="text-xs text-slate-400">({u.role})</span></td>
                                <td className="px-6 py-4 text-slate-500">{u.email}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${u.status==='Active'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{u.status}</span></td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button onClick={() => openModal({
                                        title: 'แก้ไขข้อมูล',
                                        content: <UserForm initialData={u} onSave={(data) => { onEdit({...data, id: u.id}); }} />,
                                        type: 'info'
                                    })} className="text-blue-500 hover:bg-blue-50 p-2 rounded"><Edit size={16}/></button>
                                    <button onClick={() => openModal({
                                        title: 'ยืนยันการลบ', content: <p>คุณแน่ใจไหมที่จะลบ {u.name}?</p>, type: 'danger', onConfirm: () => onDelete(u.id)
                                    })} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 📢 3. REPORT MANAGEMENT (Approve/Reject)
// ----------------------------------------------------------------------
function ReportManagement({ reports, onApprove, onReject, openModal }) {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">จัดการการแจ้งเบาะแส ({reports.length})</h1>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs text-slate-500 font-bold">
                        <tr><th className="px-6 py-4">URL</th><th className="px-6 py-4">ประเภท</th><th className="px-6 py-4">สถานะ</th><th className="px-6 py-4 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reports.map(r => (
                            <tr key={r.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-slate-700">{r.url}</td>
                                <td className="px-6 py-4 text-red-500 font-bold">{r.type}</td>
                                <td className="px-6 py-4">{r.status==='Pending' ? <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">รอตรวจสอบ</span> : <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">ดำเนินการแล้ว</span>}</td>
                                <td className="px-6 py-4 text-right">
                                    {r.status === 'Pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openModal({ title: 'ยืนยัน Blacklist', content: 'URL นี้จะถูกเพิ่มเข้า Blacklist ทันที', type: 'confirm', onConfirm: () => onApprove(r) })} className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"><ShieldAlert size={16}/></button>
                                            <button onClick={() => openModal({ title: 'ปฏิเสธรายงาน', content: 'รายงานนี้จะถูกลบออก', type: 'danger', onConfirm: () => onReject(r.id) })} className="bg-slate-100 text-slate-600 p-2 rounded hover:bg-slate-200"><Trash2 size={16}/></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// ⛔ 4. BLACKLIST MANAGEMENT
// ----------------------------------------------------------------------
function BlacklistManagement({ blacklist, onAdd, onDelete, openModal }) {
    const AddForm = ({ onSave }) => {
        const [url, setUrl] = useState('');
        return (
            <div className="flex flex-col gap-3">
                <input type="text" placeholder="URL เว็บอันตราย (เช่น http://...)" className="border p-2 rounded w-full" value={url} onChange={e=>setUrl(e.target.value)} />
                <button onClick={() => onSave({ url, level: 'Critical' })} className="bg-red-600 text-white px-4 py-2 rounded">เพิ่ม Blacklist</button>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900">ฐานข้อมูล Blacklist</h1>
                <button onClick={() => openModal({ title: 'เพิ่ม Blacklist', content: <AddForm onSave={(d) => { onAdd(d); }} />, type: 'info' })} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"><Plus size={18}/> เพิ่มรายการ</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs text-slate-500 font-bold">
                        <tr><th className="px-6 py-4">URL</th><th className="px-6 py-4">ความเสี่ยง</th><th className="px-6 py-4">วันที่</th><th className="px-6 py-4 text-right">ลบ</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {blacklist.map(b => (
                            <tr key={b.id} className="hover:bg-red-50/20">
                                <td className="px-6 py-4 font-mono text-red-600">{b.url}</td>
                                <td className="px-6 py-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">{b.level}</span></td>
                                <td className="px-6 py-4 text-slate-500">{b.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => openModal({ title: 'ยืนยันการลบ', content: 'ปลดบล็อค URL นี้ใช่หรือไม่?', type: 'danger', onConfirm: () => onDelete(b.id) })} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 📝 5. CONTENT MANAGEMENT (Placeholder)
// ----------------------------------------------------------------------
function ContentManagement({ openModal }) {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">จัดการบทความความรู้</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => openModal({ title: 'Coming Soon', content: 'ระบบเขียนบทความกำลังพัฒนา', type: 'info' })} className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center min-h-[200px] text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition">
                    <Plus size={32} /> <span className="font-bold mt-2">สร้างบทความใหม่</span>
                </div>
            </div>
        </div>
    )
}

// ----------------------------------------------------------------------
// 🧭 SIDEBAR HELPER
// ----------------------------------------------------------------------
function SidebarContent({ activeTab, setActiveTab }) {
    const MenuItem = ({ icon, label, id }) => (
        <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <div className={activeTab === id ? 'text-white' : 'text-slate-400'}>{icon}</div>
            <span className="font-medium text-sm">{label}</span>
        </button>
    );
    return (
        <>
            <div className="h-16 flex items-center px-6 border-b border-slate-800"><span className="text-lg font-bold text-white">PhishWise <span className="text-blue-500">Admin</span></span></div>
            <nav className="flex-1 py-6 px-3 space-y-1">
                <MenuItem icon={<LayoutDashboard size={20} />} label="ภาพรวมระบบ" id="dashboard" />
                <MenuItem icon={<BellRing size={20} />} label="จัดการแจ้งเบาะแส" id="reports" />
                <MenuItem icon={<Users size={20} />} label="จัดการสมาชิก" id="users" />
                <MenuItem icon={<Database size={20} />} label="ฐานข้อมูล Blacklist" id="blacklist" />
                <MenuItem icon={<BookOpen size={20} />} label="จัดการบทความ" id="content" />
            </nav>
            {/*<div className="p-4 border-t border-slate-800"><button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"><LogOut size={20} /><span className="font-medium text-sm">ออกจากระบบ</span></button></div>*/}
        </>
    );
}