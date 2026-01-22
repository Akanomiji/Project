'use client';
import { useState } from 'react';
import Modal from '@/components/Modal'; // ✅ Import Modal ที่เราสร้างไว้
import { 
  LayoutDashboard, 
  BellRing, 
  Users, 
  Database, 
  BookOpen, 
  LogOut, 
  Menu, 
  X,
  CheckCircle,
  Trash2,
  Search,
  AlertTriangle,
  FileText,
  Edit,
  Plus,
  Info
} from 'lucide-react';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- Modal State (จัดการ Popup ตรงกลางที่เดียว) ---
  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    title: '', 
    content: null, 
    type: 'info', // info, confirm, danger
    onConfirm: null 
  });

  // ฟังก์ชันเปิด Modal
  const openModal = ({ title, content, type = 'info', onConfirm = null }) => {
    setModalConfig({ isOpen: true, title, content, type, onConfirm });
  };

  // ฟังก์ชันปิด Modal
  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  // ฟังก์ชันเมื่อกดปุ่มยืนยันใน Modal
  const handleConfirm = () => {
    if (modalConfig.onConfirm) modalConfig.onConfirm();
    closeModal();
  };

  // ฟังก์ชันเลือกแสดงเนื้อหาตาม Tab (ส่ง openModal ไปให้ลูกๆ ใช้)
  const renderContent = () => {
    const props = { openModal }; // ส่งฟังก์ชันเปิด Modal ไปให้ทุกหน้า
    switch (activeTab) {
        case 'dashboard': return <DashboardStats {...props} />;
        case 'reports': return <ReportManagement {...props} />;
        case 'users': return <UserManagement {...props} />;
        case 'blacklist': return <BlacklistManagement {...props} />;
        case 'content': return <ContentManagement {...props} />;
        default: return <DashboardStats {...props} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-[#0f172a] text-slate-300 flex-col shrink-0 transition-all duration-300">
        <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Sidebar (Mobile) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-64 bg-[#0f172a] text-slate-300 flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 p-1 rounded-md hover:bg-slate-800 text-slate-400">
                <X size={20} />
            </button>
            <SidebarContent activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0">
            <div className="font-bold text-slate-900">PhishWise Admin</div>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Menu size={24} />
            </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {renderContent()}
        </div>
      </main>

      {/* ✅ เรียกใช้ Component Modal ตรงนี้ (ที่เดียวจบ) */}
      <Modal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        footer={
           // ถ้ามี onConfirm ให้โชว์ปุ่มยืนยัน ถ้าไม่มีให้โชว์แค่ปุ่มปิด
           modalConfig.onConfirm ? (
            <>
                <button onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition">ยกเลิก</button>
                <button 
                    onClick={handleConfirm} 
                    className={`px-4 py-2 text-white rounded-lg font-medium transition shadow-sm ${modalConfig.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    ยืนยัน
                </button>
            </>
           ) : (
            <button onClick={closeModal} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium transition">ปิดหน้าต่าง</button>
           )
        }
      >
        <div className="flex flex-col gap-4">
             {/* ไอคอนตามประเภท Modal */}
             {modalConfig.type === 'danger' && (
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto">
                    <Trash2 size={24} />
                </div>
             )}
             {modalConfig.type === 'confirm' && (
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto">
                    <CheckCircle size={24} />
                </div>
             )}
              {modalConfig.type === 'info' && (
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 mx-auto">
                    <Info size={24} />
                </div>
             )}
            
            <div className="text-center">
                {modalConfig.content}
            </div>
        </div>
      </Modal>

    </div>
  );
}

// ----------------------------------------------------------------------
// COMPONENTS ส่วนเนื้อหา (รับ prop openModal มาใช้)
// ----------------------------------------------------------------------

function DashboardStats() {
    const stats = [
        { title: 'ผู้ใช้งานทั้งหมด', value: '1,240', color: 'text-slate-800', border: 'border-l-4 border-blue-500' },
        { title: 'รายงานรอตรวจสอบ', value: '45', color: 'text-orange-500', border: 'border-l-4 border-orange-500' },
        { title: 'Blacklist Sites', value: '892', color: 'text-red-600', border: 'border-l-4 border-red-600' },
        { title: 'บทความเผยแพร่', value: '12', color: 'text-blue-600', border: 'border-l-4 border-blue-600' },
    ];

    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">ภาพรวมระบบ (System Overview)</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 ${stat.border}`}>
                        <span className="text-sm font-medium text-slate-500">{stat.title}</span>
                        <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-96 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <LayoutDashboard size={32} />
                </div>
                <p className="text-slate-400 font-medium">[พื้นที่แสดงกราฟสถิติ]</p>
            </div>
        </div>
    );
}

// ✅ 2. Reports (มีการใช้ openModal)
function ReportManagement({ openModal }) {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">จัดการการแจ้งเบาะแส</h1>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">URL ที่แจ้ง</th>
                                <th className="px-6 py-4 whitespace-nowrap">ประเภท</th>
                                <th className="px-6 py-4 whitespace-nowrap">ผู้แจ้ง</th>
                                <th className="px-6 py-4 whitespace-nowrap">สถานะ</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-medium text-slate-900 max-w-[200px] truncate">http://fake-login-bank-{i}.com</td>
                                    <td className="px-6 py-4 text-slate-500">Phishing</td>
                                    <td className="px-6 py-4 text-slate-500">user_{i}</td>
                                    <td className="px-6 py-4"><span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">รอตรวจสอบ</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => openModal({
                                                    title: 'ยืนยันการอนุมัติ',
                                                    content: <p>คุณต้องการอนุมัติ URL นี้เข้าสู่ระบบ Blacklist ใช่หรือไม่?</p>,
                                                    type: 'confirm',
                                                    onConfirm: () => alert('อนุมัติเรียบร้อย!')
                                                })}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="อนุมัติ"
                                            >
                                                <CheckCircle size={18}/>
                                            </button>
                                            <button 
                                                onClick={() => openModal({
                                                    title: 'ยืนยันการปฏิเสธ',
                                                    content: <p>คุณต้องการลบรายงานนี้ทิ้งใช่หรือไม่? การกระทำนี้ไม่สามารถเรียกคืนได้</p>,
                                                    type: 'danger',
                                                    onConfirm: () => alert('ลบรายงานเรียบร้อย!')
                                                })}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="ลบ/ปฏิเสธ"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ✅ 3. Users (มีการใช้ openModal)
function UserManagement({ openModal }) {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">จัดการสมาชิก</h1>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                    <input type="text" placeholder="ค้นหาชื่อ, อีเมล..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"/>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">ค้นหา</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">ชื่อผู้ใช้</th>
                                <th className="px-6 py-4">อีเมล</th>
                                <th className="px-6 py-4">วันที่สมัคร</th>
                                <th className="px-6 py-4">สถานะ</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-bold text-slate-700">Somchai_{i}</td>
                                    <td className="px-6 py-4 text-slate-500">somchai{i}@email.com</td>
                                    <td className="px-6 py-4 text-slate-500">12 ม.ค. 2024</td>
                                    <td className="px-6 py-4"><span className="text-green-600 font-bold text-xs">● Active</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => openModal({
                                                title: 'แก้ไขข้อมูลสมาชิก',
                                                content: <p>ระบบแก้ไขสมาชิกกำลังอยู่ระหว่างการพัฒนา</p>,
                                                type: 'info'
                                            })}
                                            className="text-slate-400 hover:text-blue-600 font-medium text-xs border border-slate-200 px-3 py-1 rounded hover:border-blue-300"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ✅ 4. Blacklist (มีการใช้ openModal)
function BlacklistManagement({ openModal }) {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">ฐานข้อมูล Blacklist</h1>
                <button 
                    onClick={() => openModal({
                        title: 'เพิ่มรายการใหม่',
                        content: <p>ฟอร์มสำหรับเพิ่ม Blacklist จะแสดงตรงนี้</p>,
                        type: 'info'
                    })}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-red-700 transition shadow-sm"
                >
                    <Plus size={18} /> เพิ่มรายการใหม่
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                        <input type="text" placeholder="ค้นหา URL ในบัญชีดำ..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"/>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Blacklist URL</th>
                                <th className="px-6 py-4">ระดับความเสี่ยง</th>
                                <th className="px-6 py-4">วันที่เพิ่ม</th>
                                <th className="px-6 py-4 text-right">ลบ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                             <tr className="hover:bg-red-50/30">
                                <td className="px-6 py-4 font-mono text-red-600">http://phishing-site.xyz</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">Critical</span></td>
                                <td className="px-6 py-4 text-slate-500">วันนี้</td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => openModal({
                                            title: 'ยืนยันการลบ',
                                            content: <p>ต้องการลบ URL นี้ออกจาก Blacklist หรือไม่?</p>,
                                            type: 'danger',
                                            onConfirm: () => alert('ลบแล้ว')
                                        })}
                                        className="text-slate-400 hover:text-red-600"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ✅ 5. Content (มีการใช้ openModal)
function ContentManagement({ openModal }) {
    return (
        <div className="animate-in fade-in zoom-in-95 duration-300">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">จัดการบทความความรู้</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                    onClick={() => openModal({
                        title: 'สร้างบทความใหม่',
                        content: <p>ฟอร์มสร้างบทความจะแสดงตรงนี้</p>,
                        type: 'info'
                    })}
                    className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center min-h-[200px] text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition group"
                >
                    <div className="p-4 bg-slate-100 rounded-full group-hover:bg-white mb-3 transition">
                        <Plus size={32} />
                    </div>
                    <span className="font-bold">สร้างบทความใหม่</span>
                </div>

                {[1, 2].map((i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">Knowledge</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => openModal({title: 'แก้ไขบทความ', content: 'หน้าต่างแก้ไข', type: 'info'})}
                                        className="text-slate-400 hover:text-blue-600"
                                    >
                                        <Edit size={16}/>
                                    </button>
                                    <button 
                                        onClick={() => openModal({
                                            title: 'ลบบทความ',
                                            content: <p>คุณต้องการลบบทความนี้ใช่หรือไม่?</p>,
                                            type: 'danger',
                                            onConfirm: () => alert('ลบบทความแล้ว')
                                        })}
                                        className="text-slate-400 hover:text-red-600"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">วิธีป้องกัน Phishing ในยุค AI ครองเมือง #{i}</h3>
                            <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                                เรียนรู้วิธีการสังเกตและป้องกันตัวเองจากการโจมตีทางไซเบอร์รูปแบบใหม่...
                            </p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                            <span>Last update: 2 days ago</span>
                            <span className="flex items-center gap-1 text-green-600 font-bold"><CheckCircle size={12}/> Published</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SidebarContent({ activeTab, setActiveTab }) {
    return (
        <>
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <span className="text-lg font-bold text-white tracking-wide">
                    PhishWise <span className="text-blue-500">Admin</span>
                </span>
            </div>
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <MenuItem icon={<LayoutDashboard size={20} />} label="ภาพรวมระบบ" id="dashboard" activeTab={activeTab} onClick={setActiveTab} />
                <MenuItem icon={<BellRing size={20} />} label="จัดการการแจ้งเบาะแส" id="reports" activeTab={activeTab} onClick={setActiveTab} />
                <MenuItem icon={<Users size={20} />} label="จัดการสมาชิก" id="users" activeTab={activeTab} onClick={setActiveTab} />
                <MenuItem icon={<Database size={20} />} label="ฐานข้อมูล Blacklist" id="blacklist" activeTab={activeTab} onClick={setActiveTab} />
                <MenuItem icon={<BookOpen size={20} />} label="จัดการบทความ" id="content" activeTab={activeTab} onClick={setActiveTab} />
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-200">
                    <LogOut size={20} />
                    <span className="font-medium text-sm">ออกจากระบบ</span>
                </button>
            </div>
        </>
    );
}

function MenuItem({ icon, label, id, activeTab, onClick }) {
    const isActive = activeTab === id;
    return (
        <button 
            onClick={() => onClick(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
            `}
        >
            <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                {icon}
            </div>
            <span className="font-medium text-sm">{label}</span>
        </button>
    );
}