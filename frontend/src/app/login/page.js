'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } else {
      router.push('/'); // Login สำเร็จกลับหน้าหลัก (หรือจะไป Dashboard ก็ได้)
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-2">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">PhishWise Login</h1>
          <p className="text-slate-500 text-sm">เข้าสู่ระบบเพื่อใช้งานฟังก์ชันสมาชิก</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="admin@test.com"
                  required
                />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="123456"
                  required
                />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}

          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            เข้าสู่ระบบ
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-500">
            ยังไม่มีบัญชี? <a href="#" className="text-blue-600 font-bold hover:underline">ลงทะเบียนฟรี</a>
        </div>
        
        {/* Hint สำหรับทดสอบ */}
        <div className="mt-8 p-4 bg-slate-100 rounded-lg text-xs text-slate-500">
            <p className="font-bold mb-1">Testing Accounts:</p>
            <p>Admin: admin@test.com / 123456</p>
            <p>Member: member@test.com / 123456</p>
        </div>
      </div>
    </div>
  );
}