'use client';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  // ปิด Popup เมื่อกดปุ่ม ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // ล็อกไม่ให้หน้าหลังเลื่อน (Background Scroll Lock) ตอนเปิด Modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Backdrop (พื้นหลังมืด)
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* 1. Header (ติดอยู่ด้านบนเสมอ ไม่เลื่อนตาม) */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl shrink-0">
          <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
          >
            <X size={24} /> {/* ปุ่มใหญ่ขึ้นหน่อยสำหรับนิ้วกด */}
          </button>
        </div>

        {/* 2. Body (ส่วนเนื้อหา - Scroll ได้ถ้าเนื้อหายาว) */}
        <div className="px-5 py-6 text-slate-600 overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* 3. Footer (ถ้ามี - ติดอยู่ด้านล่างเสมอ) */}
        {footer && (
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}