import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password); 

    if (result.success) {
        if (result.role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    } else {
        setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-slate-900">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 animate-fade-in-up">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <ShieldCheck size={40} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">ยินดีต้อนรับกลับ!</h1>
            <p className="text-slate-500">เข้าสู่ระบบเพื่อใช้งาน PhishWise</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">อีเมล</label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">รหัสผ่าน</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>
          </div>

          {/* ✅ เพิ่มส่วน ลืมรหัสผ่าน ตรงนี้ */}
          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-shake">
                <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            เข้าสู่ระบบ
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-500">
            ยังไม่มีบัญชี? <Link to="/register" className="text-blue-600 font-bold hover:underline">ลงทะเบียนฟรี</Link>
        </div>
        
        {/* Hint สำหรับทดสอบ */}
        {/* <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500">
            <p className="font-bold text-slate-700 mb-2">💡 บัญชีทดสอบ (Demo Account):</p>
            <div className="flex justify-between mb-1">
                <span>User:</span>
                <span className="font-mono bg-white px-1 rounded border">somchai@test.com</span>
            </div>
            <div className="flex justify-between mb-1">
                <span>Admin:</span>
                <span className="font-mono bg-white px-1 rounded border">admin@test.com</span>
            </div>
            <div className="flex justify-between">
               <span>Pass:</span>
               <span className="font-mono bg-white px-1 rounded border">123456</span>
            </div>
        </div> */}
      </div>
    </div>
  );
}