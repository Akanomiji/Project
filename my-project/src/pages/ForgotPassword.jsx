import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // จำลองการส่ง API (Mock API Call)
    setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-slate-900">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-4">
                <KeyRound size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">ลืมรหัสผ่าน?</h1>
            <p className="text-slate-500 mt-2">
                ไม่ต้องกังวล! กรอกอีเมลของคุณด้านล่าง <br/> เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้
            </p>
        </div>

        {!isSubmitted ? (
            /* Form ก่อนส่ง */
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">อีเมลที่ลงทะเบียน</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input 
                            type="email" 
                            required
                            placeholder="name@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            กำลังส่งข้อมูล...
                        </span>
                    ) : (
                        "ส่งลิงก์กู้คืนรหัสผ่าน"
                    )}
                </button>
            </form>
        ) : (
            /* Success State หลังจากกดส่ง */
            <div className="text-center bg-green-50 p-6 rounded-xl border border-green-100 animate-fade-in">
                <div className="flex justify-center mb-3">
                    <CheckCircle className="text-green-600" size={48} />
                </div>
                <h3 className="font-bold text-green-800 text-lg">ตรวจสอบอีเมลของคุณ</h3>
                <p className="text-sm text-green-700 mt-1">
                    เราได้ส่งลิงก์กู้คืนรหัสผ่านไปที่ <br/> <span className="font-semibold">{email}</span> แล้ว
                </p>
                <p className="text-xs text-slate-400 mt-4">
                    หากไม่ได้รับอีเมล ลองตรวจสอบในโฟลเดอร์ Junk/Spam
                </p>
            </div>
        )}

        {/* Back to Login */}
        <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center text-slate-500 hover:text-slate-800 font-semibold transition-colors">
                <ArrowLeft size={16} className="mr-2" /> กลับไปหน้าเข้าสู่ระบบ
            </Link>
        </div>

      </div>
    </div>
  );
}