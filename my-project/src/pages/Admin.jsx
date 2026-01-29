import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ เพิ่ม useNavigate
import { 
  LayoutDashboard, BellRing, Users, BookOpen, LogOut, Menu, X,
  CheckCircle, Trash2, Search, FileText, Edit, Plus,
  ShieldAlert, Globe, ExternalLink, Save, XCircle,
  ShieldBan, Ban, ChevronLeft, ChevronRight, Eye, Image as ImageIcon, UploadCloud,
  Activity, ShieldCheck, AlertOctagon, Home // ✅ เพิ่ม Home icon
} from 'lucide-react';

// --- Library กราฟและแผนที่ ---
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// ==========================================
// 🛠️ Helper Component: Pagination
// ==========================================
function TablePagination({ currentPage, totalPages, onPageChange, totalItems }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
       <span className="text-sm text-slate-500">
          แสดงข้อมูล {totalItems > 0 ? (currentPage - 1) * 5 + 1 : 0} ถึง {Math.min(currentPage * 5, totalItems)} จาก {totalItems} รายการ
       </span>
       <div className="flex items-center gap-2">
          <button 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
          <span className="text-sm font-bold text-slate-700">
            หน้า {currentPage} / {totalPages || 1}
          </span>
          <button 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronRight size={18} className="text-slate-600" />
          </button>
       </div>
    </div>
  );
}

// ==========================================
// 🛠️ Internal Component: Modal
// ==========================================
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-scale-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 🚀 MAIN COMPONENT: AdminDashboard
// ==========================================
export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // --- Mock Data ---
  const [users, setUsers] = useState(Array.from({ length: 12 }, (_, i) => ({
    id: i + 1, 
    name: `User Demo ${i+1}`, 
    email: `user${i+1}@test.com`, 
    role: i === 0 ? "Admin" : "Member", 
    status: i % 3 === 0 ? "Banned" : "Active", 
    joinDate: "12 ม.ค. 67" 
  })));

  const [reports, setReports] = useState(Array.from({ length: 8 }, (_, i) => ({
    id: 100 + i, 
    url: `http://suspicious-link-${i}.com`, 
    type: i % 2 === 0 ? "Phishing" : "Scam", 
    reporter: `User${i}`, 
    status: i === 0 ? "Pending" : (i % 2 === 0 ? "Verified" : "Rejected"), 
    date: "วันนี้ 10:30" 
  })));

  const [blacklist, setBlacklist] = useState([
    { id: 1, url: "paypal-security-check.com", reason: "Phishing Clone", date: "12 ม.ค. 67", admin: "Admin Boss" },
    { id: 2, url: "free-bet-888.net", reason: "Gambling/Scam", date: "14 ก.พ. 67", admin: "System AI" },
  ]);

  const [knowledgeList, setKnowledgeList] = useState([
    { id: 1, title: "วิธีสังเกต Phishing URL", category: "Basics", views: 1240, lastUpdate: "10 ม.ค. 67", image: "https://images.unsplash.com/photo-1563206767-5b1d97289374?auto=format&fit=crop&w=300&q=80", content: "เนื้อหาบทความ..." },
    { id: 2, title: "Top 10 กลโกงปี 2024", category: "Trends", views: 850, lastUpdate: "15 ก.พ. 67", image: null, content: "เนื้อหาบทความ..." },
    { id: 3, title: "ความปลอดภัยของรหัสผ่าน", category: "Basics", views: 500, lastUpdate: "16 ก.พ. 67", image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=300&q=80", content: "เนื้อหาบทความ..." },
    { id: 4, title: "Malware คืออะไร?", category: "Advanced", views: 320, lastUpdate: "18 ก.พ. 67", image: null, content: "เนื้อหาบทความ..." },
  ]);

  // --- Modal Logic ---
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [selectedKnowledge, setSelectedKnowledge] = useState(null);

  const openEditUserModal = (user) => { setSelectedUser(user); setModalType('editUser'); setModalOpen(true); };
  const openAddKnowledgeModal = () => { setSelectedKnowledge(null); setModalType('addKnowledge'); setModalOpen(true); };
  const openEditKnowledgeModal = (item) => { setSelectedKnowledge(item); setModalType('editKnowledge'); setModalOpen(true); };
  const openAddBlacklistModal = () => { setModalType('addBlacklist'); setModalOpen(true); };

  // --- Actions ---
  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id));
  const updateReportStatus = (id, newStatus) => setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
  const deleteKnowledge = (id) => setKnowledgeList(knowledgeList.filter(k => k.id !== id));
  
  const saveKnowledge = (data) => {
     if (modalType === 'addKnowledge') {
        const newItem = { 
            id: Date.now(), 
            ...data, 
            views: 0, 
            lastUpdate: "วันนี้" 
        };
        setKnowledgeList([newItem, ...knowledgeList]);
     } else {
        setKnowledgeList(knowledgeList.map(k => k.id === data.id ? data : k));
     }
     setModalOpen(false);
  };

  const deleteBlacklist = (id) => setBlacklist(blacklist.filter(b => b.id !== id));
  const addBlacklist = (newItem) => {
    setBlacklist([...blacklist, { ...newItem, id: Date.now(), date: "วันนี้", admin: "Admin Boss" }]);
    setModalOpen(false);
  };

  const saveUserStatus = () => {
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    // ✅ ใช้ h-screen เพื่อให้เต็มจอ (และซ่อน Navbar หลักที่ App.jsx)
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* 📱 Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* 🧭 SIDEBAR */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-xl`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <ShieldAlert className="w-8 h-8 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-slate-800">PhishWise</span>
        </div>
        
        {/* Menu Content */}
        <SidebarContent activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} />
      </aside>

      {/* 📄 MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 shadow-sm shrink-0">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-bold text-slate-800 ml-2 lg:ml-0">
                    {activeTab === 'dashboard' && 'ภาพรวมระบบ'}
                    {activeTab === 'reports' && 'จัดการแจ้งเบาะแส'}
                    {activeTab === 'blacklist' && 'จัดการบัญชีดำ (Blacklist)'}
                    {activeTab === 'users' && 'จัดการสมาชิก'}
                    {activeTab === 'knowledge' && 'คลังความรู้'}
                </h1>
            </div>
            
            {/* User Profile (Optional) */}
             <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                    <p className="text-sm font-bold text-slate-700">Admin User</p>
                    <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    A
                </div>
             </div>
        </header>

        {/* Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'reports' && <ReportsView reports={reports} updateStatus={updateReportStatus} />}
            {activeTab === 'blacklist' && <BlacklistView blacklist={blacklist} deleteItem={deleteBlacklist} openAddModal={openAddBlacklistModal} />}
            {activeTab === 'users' && <UsersView users={users} deleteUser={deleteUser} openEditModal={openEditUserModal} />}
            {activeTab === 'knowledge' && <KnowledgeView list={knowledgeList} deleteItem={deleteKnowledge} openAddModal={openAddKnowledgeModal} openEditModal={openEditKnowledgeModal} />}
        </main>
      </div>

      {/* 🖼️ MODAL POPUP */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title={
            modalType === 'addKnowledge' ? 'สร้างกระทู้ / บทความใหม่' : 
            modalType === 'editKnowledge' ? 'แก้ไขบทความ' :
            modalType === 'addBlacklist' ? 'เพิ่ม Blacklist' : 
            'แก้ไขสถานะสมาชิก'
        }
      >
         {/* Forms for Modals */}
         {(modalType === 'addKnowledge' || modalType === 'editKnowledge') && (
             <KnowledgeForm initialData={selectedKnowledge} onSubmit={saveKnowledge} onCancel={() => setModalOpen(false)} />
         )}
         {modalType === 'addBlacklist' && (
            <form onSubmit={(e) => {
                e.preventDefault();
                addBlacklist({ url: e.target.url.value, reason: e.target.reason.value });
            }} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">URL ที่ต้องการแบน</label>
                    <input name="url" type="text" placeholder="ex. malicious-site.com" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">เหตุผล</label>
                    <select name="reason" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none">
                        <option>Phishing Website</option>
                        <option>Scam / Fraud</option>
                        <option>Malware</option>
                        <option>Gambling</option>
                    </select>
                </div>
                <button type="submit" className="bg-red-600 text-white py-2.5 rounded-lg font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex justify-center items-center gap-2">
                    <ShieldBan size={18} /> ยืนยันการแบน
                </button>
            </form>
         )}
         {modalType === 'editUser' && selectedUser && (
             <div className="flex flex-col gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">สมาชิกที่เลือก</p>
                    <p className="text-slate-900 font-bold text-lg">{selectedUser.name}</p>
                    <p className="text-slate-500">{selectedUser.email}</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">สถานะบัญชี</label>
                    <select 
                        value={selectedUser.status}
                        onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Active">Active (ปกติ)</option>
                        <option value="Banned">Banned (ระงับการใช้งาน)</option>
                    </select>
                </div>
                <button onClick={saveUserStatus} className="mt-2 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2">
                    <Save size={18} /> บันทึกการเปลี่ยนแปลง
                </button>
             </div>
         )}
      </Modal>
    </div>
  );
}

// ----------------------------------------------------------------------
// 📝 NEW COMPONENT: Knowledge Form
// ----------------------------------------------------------------------
function KnowledgeForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        id: initialData?.id || null,
        title: initialData?.title || '',
        category: initialData?.category || 'Basics',
        content: initialData?.content || '',
        image: initialData?.image || null
    });
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData({ ...formData, image: imageUrl });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-400 transition-colors cursor-pointer">
                {formData.image ? (
                    <>
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold flex items-center gap-2"><Edit size={16}/> เปลี่ยนรูปภาพ</span>
                        </div>
                    </>
                ) : (
                    <div className="text-slate-400 flex flex-col items-center">
                        <UploadCloud size={32} className="mb-2" />
                        <span className="text-sm font-medium">คลิกเพื่ออัปโหลดรูปภาพ</span>
                    </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">หัวข้อกระทู้ / บทความ</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="ใส่ชื่อหัวข้อ..." className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">หมวดหมู่</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-900 outline-none">
                    <option>Basics</option>
                    <option>Advanced</option>
                    <option>Trends</option>
                    <option>News</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">เนื้อหา</label>
                <textarea rows="5" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} placeholder="เขียนรายละเอียดเนื้อหาที่นี่..." className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <button onClick={() => onSubmit(formData)} className="mt-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex justify-center items-center gap-2">
                <Save size={18} /> {initialData ? 'บันทึกการแก้ไข' : 'สร้างบทความ'}
            </button>
        </div>
    )
}

// ----------------------------------------------------------------------
// 🧭 SIDEBAR Helper (Updated with Logout & Home)
// ----------------------------------------------------------------------
function SidebarContent({ activeTab, setActiveTab }) {
    const navigate = useNavigate(); // ✅ ใช้ Hook สำหรับเปลี่ยนหน้า

    const MenuItem = ({ icon, label, id }) => (
        <button onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === id ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
            <div className={activeTab === id ? 'text-blue-600' : 'text-slate-400'}>{icon}</div>
            <span className="text-sm">{label}</span>
        </button>
    );

    const handleLogout = () => {
        // สามารถเพิ่ม Logic ล้าง Token ตรงนี้ได้
        navigate('/login');
    };

    return (
        <div className="flex flex-col flex-1 h-full">
            <div className="h-4"></div>
            {/* Main Menu */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                <MenuItem icon={<LayoutDashboard size={20} />} label="ภาพรวมระบบ" id="dashboard" />
                <MenuItem icon={<BellRing size={20} />} label="จัดการแจ้งเบาะแส" id="reports" />
                <MenuItem icon={<ShieldBan size={20} />} label="จัดการ Blacklist" id="blacklist" />
                <MenuItem icon={<Users size={20} />} label="จัดการสมาชิก" id="users" />
                <MenuItem icon={<BookOpen size={20} />} label="คลังความรู้" id="knowledge" />
            </nav>

            {/* ✅ Footer Menu (Back Home & Logout) */}
            <div className="p-4 border-t border-slate-200 mt-auto space-y-2">
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    <Home className="w-5 h-5 mr-3 text-slate-400" />
                    <span className="font-medium text-sm">กลับหน้าหลัก</span>
                </button>

                <button 
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5 mr-3 text-red-400 group-hover:text-red-600" />
                    <span className="font-medium text-sm">ออกจากระบบ</span>
                </button>
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// 📊 DASHBOARD VIEW (UPDATED 🆕)
// ----------------------------------------------------------------------
function DashboardView() {
    // 1. State สำหรับตัวเลือกช่วงเวลา
    const [filter, setFilter] = useState('Week');

    // 2. ข้อมูล Mock Data แยกตามช่วงเวลา
    const chartData = {
        Day: [
            { name: '00:00', safe: 15, threat: 2 },
            { name: '04:00', safe: 25, threat: 5 },
            { name: '08:00', safe: 45, threat: 10 },
            { name: '12:00', safe: 80, threat: 20 },
            { name: '16:00', safe: 120, threat: 15 },
            { name: '20:00', safe: 60, threat: 8 },
            { name: '23:59', safe: 30, threat: 4 },
        ],
        Week: [
            { name: 'Mon', safe: 150, threat: 20 },
            { name: 'Tue', safe: 230, threat: 45 },
            { name: 'Wed', safe: 180, threat: 30 },
            { name: 'Thu', safe: 280, threat: 50 },
            { name: 'Fri', safe: 350, threat: 80 },
            { name: 'Sat', safe: 200, threat: 40 },
            { name: 'Sun', safe: 120, threat: 15 },
        ],
        Month: [
            { name: 'Week 1', safe: 800, threat: 120 },
            { name: 'Week 2', safe: 950, threat: 150 },
            { name: 'Week 3', safe: 1200, threat: 200 },
            { name: 'Week 4', safe: 1100, threat: 180 },
        ],
        Year: [
            { name: 'Jan', safe: 3000, threat: 400 },
            { name: 'Mar', safe: 3500, threat: 500 },
            { name: 'May', safe: 4200, threat: 300 },
            { name: 'Jul', safe: 5000, threat: 700 },
            { name: 'Sep', safe: 4800, threat: 600 },
            { name: 'Nov', safe: 5500, threat: 800 },
        ],
        All: [
            { name: '2021', safe: 15000, threat: 2000 },
            { name: '2022', safe: 28000, threat: 4500 },
            { name: '2023', safe: 42000, threat: 6000 },
            { name: '2024', safe: 58000, threat: 8500 },
        ]
    };

    // ข้อมูลแผนที่ (เหมือนเดิม)
    const threatMapData = [
        { name: "Thailand", coordinates: [100.9925, 15.8700] },
        { name: "USA", coordinates: [-95.7129, 37.0902] },
        { name: "Russia", coordinates: [105.3188, 61.5240] },
        { name: "China", coordinates: [104.1954, 35.8617] },
        { name: "Brazil", coordinates: [-51.9253, -14.2350] },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            
            {/* 1. Main Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Users" value="12,345" icon={<Users size={24} />} color="blue" diff="+12%" />
                <StatCard title="Phishing Detected" value="843" icon={<ShieldAlert size={24} />} color="red" diff="+5.4%" />
                <StatCard title="Reports Today" value="56" icon={<BellRing size={24} />} color="orange" diff="-2%" />
                <StatCard title="Blacklisted URLs" value="1,024" icon={<ShieldBan size={24} />} color="purple" diff="+8%" />
            </div>

            {/* 2. Today's Scan Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white/20 rounded-lg"><Activity size={24} /></div>
                            <span className="font-bold opacity-90">วันนี้มีคนสแกน</span>
                        </div>
                        <p className="text-4xl font-extrabold mb-1">1,240 <span className="text-base font-normal opacity-80">ครั้ง</span></p>
                        <p className="text-xs opacity-70">Total Scans Today</p>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-green-200 transition-colors">
                    <div>
                        <p className="text-slate-500 font-bold mb-1">เว็บปลอดภัย</p>
                        <p className="text-3xl font-extrabold text-green-600">1,100</p>
                        <p className="text-xs text-slate-400 mt-1">Safe Websites Found</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-full group-hover:scale-110 transition-transform">
                        <ShieldCheck size={32} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between group hover:border-red-200 transition-colors">
                    <div>
                        <p className="text-slate-500 font-bold mb-1">เว็บมีความเสี่ยง</p>
                        <p className="text-3xl font-extrabold text-red-600">140</p>
                        <p className="text-xs text-slate-400 mt-1">Dangerous Websites Found</p>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-full animate-pulse">
                        <AlertOctagon size={32} />
                    </div>
                </div>
            </div>

            {/* 3. Charts & Map Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Area Chart with Time Filter */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                         <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                            <Activity className="text-blue-600" size={20}/> สถิติการใช้งาน
                         </h3>
                         
                         {/* 🕒 Time Filter Buttons */}
                         <div className="flex bg-slate-100 p-1 rounded-xl">
                            {['Day', 'Week', 'Month', 'Year', 'All'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setFilter(range)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                        filter === range 
                                        ? 'bg-white text-blue-600 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {range === 'Day' ? 'วัน' : 
                                     range === 'Week' ? 'สัปดาห์' : 
                                     range === 'Month' ? 'เดือน' : 
                                     range === 'Year' ? 'ปี' : 'ทั้งหมด'}
                                </button>
                            ))}
                         </div>
                    </div>

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData[filter]}>
                                <defs>
                                    <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94A3B8', fontSize: 12}} 
                                    dy={10} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94A3B8', fontSize: 12}} 
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: '#fff', 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="safe" 
                                    stroke="#10B981" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorSafe)" 
                                    name="ปลอดภัย (Safe)" 
                                    animationDuration={1000}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="threat" 
                                    stroke="#EF4444" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorThreat)" 
                                    name="อันตราย (Threat)" 
                                    animationDuration={1000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* World Map (เหมือนเดิม) */}
                <div className="bg-slate-800 p-6 rounded-2xl shadow-lg shadow-slate-300 overflow-hidden relative flex flex-col">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                        <Globe className="text-blue-400" size={20}/> แหล่งที่มาภัยคุกคาม
                    </h3>
                    <div className="flex-1 flex items-center justify-center min-h-[300px]">
                        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                    <Geography key={geo.rsmKey} geography={geo} fill="#334155" stroke="#1e293b" strokeWidth={0.5} style={{ default: { outline: "none" }, hover: { fill: "#475569", outline: "none" }, pressed: { outline: "none" } }} />
                                    ))
                                }
                            </Geographies>
                            {threatMapData.map(({ name, coordinates }) => (
                                <Marker key={name} coordinates={coordinates}>
                                    <circle r={6} fill="#F87171" stroke="#fff" strokeWidth={2} className="animate-ping opacity-75" />
                                    <circle r={4} fill="#EF4444" stroke="#fff" strokeWidth={1} />
                                </Marker>
                            ))}
                        </ComposableMap>
                    </div>
                    {/* Legend Overlay */}
                    <div className="absolute bottom-4 left-4 bg-slate-900/80 p-3 rounded-lg backdrop-blur-sm z-10 border border-slate-700">
                         <div className="flex items-center gap-2 text-xs text-white">
                             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Threat Origin
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, diff }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 border border-blue-100",
        red: "bg-red-50 text-red-600 border border-red-100",
        orange: "bg-orange-50 text-orange-600 border border-orange-100",
        purple: "bg-purple-50 text-purple-600 border border-purple-100",
    }
    const isPositive = diff.startsWith('+');
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{diff}</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
    )
}

// ----------------------------------------------------------------------
// 📋 SUB-VIEWS (Reports, Blacklist, Users, Knowledge)
// ----------------------------------------------------------------------

function ReportsView({ reports, updateStatus }) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const paginatedData = reports.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800">รายการแจ้งเบาะแสล่าสุด</h3>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input type="text" placeholder="ค้นหา..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4 w-16 text-center">#</th>
                            <th className="p-4">URL / รายละเอียด</th>
                            <th className="p-4">ประเภท</th>
                            <th className="p-4">ผู้แจ้ง</th>
                            <th className="p-4">สถานะ</th>
                            <th className="p-4 text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {paginatedData.map((r, index) => (
                            <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-center text-slate-400 font-mono">{(page - 1) * rowsPerPage + index + 1}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Globe size={16} /></div>
                                        <div>
                                            <p className="font-bold text-slate-800 truncate max-w-[200px]">{r.url}</p>
                                            <p className="text-xs text-slate-400">{r.date}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${r.type === 'Phishing' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                        {r.type}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-600">{r.reporter}</td>
                                <td className="p-4">
                                    <span className={`flex items-center gap-1.5 text-xs font-bold ${r.status === 'Verified' ? 'text-green-600' : r.status === 'Rejected' ? 'text-red-500' : 'text-yellow-600'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${r.status === 'Verified' ? 'bg-green-500' : r.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                        {r.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {r.status === 'Pending' && (
                                            <>
                                                <button onClick={() => updateStatus(r.id, 'Verified')} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 border border-green-100"><CheckCircle size={16} /></button>
                                                <button onClick={() => updateStatus(r.id, 'Rejected')} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-100"><XCircle size={16} /></button>
                                            </>
                                        )}
                                        <button className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 border border-slate-200"><ExternalLink size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <TablePagination currentPage={page} totalPages={Math.ceil(reports.length / rowsPerPage)} onPageChange={setPage} totalItems={reports.length} />
        </div>
    );
}

function BlacklistView({ blacklist, deleteItem, openAddModal }) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const paginatedData = blacklist.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <ShieldBan className="text-red-500" /> Blacklist URLs
                    </h3>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-red-200 transition-all text-sm">
                    <Plus size={16} /> เพิ่ม Blacklist
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4 w-16 text-center">#</th>
                            <th className="p-4">Malicious URL</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Added By</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.map((item, index) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-center text-slate-400 font-mono">{(page - 1) * rowsPerPage + index + 1}</td>
                                <td className="p-4 font-mono text-red-600 font-bold">{item.url}</td>
                                <td className="p-4">
                                    <span className="bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 text-xs font-bold">
                                        {item.reason}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-600">{item.admin}</td>
                                <td className="p-4 text-slate-500 text-xs">{item.date}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => deleteItem(item.id)} className="p-2 bg-slate-100 text-slate-500 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors border border-slate-200 hover:border-green-200" title="ปลดแบน">
                                        <Ban size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <TablePagination currentPage={page} totalPages={Math.ceil(blacklist.length / rowsPerPage)} onPageChange={setPage} totalItems={blacklist.length} />
        </div>
    );
}

function UsersView({ users, deleteUser, openEditModal }) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const paginatedData = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800">จัดการสมาชิกทั้งหมด</h3>
                <div className="text-sm text-slate-500">Total: {users.length} Users</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4 w-16 text-center">#</th>
                            <th className="p-4">User Info</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.map((u, index) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-center text-slate-400 font-mono">{(page - 1) * rowsPerPage + index + 1}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{u.name}</p>
                                            <p className="text-xs text-slate-500">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600">{u.role}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${u.status === 'Active' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openEditModal(u)} className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => deleteUser(u.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <TablePagination currentPage={page} totalPages={Math.ceil(users.length / rowsPerPage)} onPageChange={setPage} totalItems={users.length} />
        </div>
    );
}

function KnowledgeView({ list, deleteItem, openAddModal, openEditModal }) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const paginatedData = list.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">Knowledge Base</h3>
                    <p className="text-slate-500 text-sm">จัดการบทความ (Topic)</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm">
                    <Plus size={18} /> สร้างกระทู้ใหม่
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4 w-16 text-center">#</th>
                            <th className="p-4">Image</th>
                            <th className="p-4">Topic / Title</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Stats</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.map((item, index) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-center text-slate-400 font-mono">{(page - 1) * rowsPerPage + index + 1}</td>
                                <td className="p-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                                        {item.image ? (
                                            <img src={item.image} alt="thumb" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={20} className="text-slate-400" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-slate-800 max-w-xs truncate">{item.title}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded border border-slate-200 bg-slate-100 text-slate-600 text-xs font-bold">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 text-xs">
                                     <div className="flex items-center gap-1"><Eye size={14}/> {item.views}</div>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openEditModal(item)} className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => deleteItem(item.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <TablePagination currentPage={page} totalPages={Math.ceil(list.length / rowsPerPage)} onPageChange={setPage} totalItems={list.length} />
        </div>
    );
}