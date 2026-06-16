import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("ลงทะเบียนสำเร็จ (Demo Mode)");
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={32} />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-slate-900">สร้างบัญชีใหม่</h2>
            <p className="mt-2 text-sm text-slate-600">สมัครสมาชิกเพื่อใช้งาน PhishWise</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
                <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input type="text" required className="pl-10 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ชื่อ-นามสกุล" />
                </div>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input type="email" required className="pl-10 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="อีเมล" />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input type="password" required className="pl-10 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="รหัสผ่าน" />
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
                    <input type="password" required className="pl-10 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ยืนยันรหัสผ่าน" />
                </div>
            </div>

            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                ลงทะเบียน
            </button>
        </form>

        <div className="text-center text-sm">
            <span className="text-slate-500">มีบัญชีอยู่แล้ว? </span>
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">
                เข้าสู่ระบบ
            </Link>
        </div>
      </div>
    </div>
  );
}