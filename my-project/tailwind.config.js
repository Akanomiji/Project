/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ✅ 1. ตั้งค่าฟอนต์ให้เหมือน Next.js (Inter)
      fontFamily: {
        sans: ['Inter', 'Sarabun', 'sans-serif'],
      },
      // ✅ 2. ย้ายค่าสีจาก globals.css มาใส่ตรงนี้แทน
      colors: {
        primary: '#0F172A',   // Deep Royal Blue
        secondary: '#1E40AF', // Hover Blue
        accent: '#7C3AED',    // Electric Purple
        success: '#10B981',   // Emerald Green
        danger: '#EF4444',    // Neon Red
        warning: '#F59E0B',   // Amber
        background: '#F8FAFC',// Slate White (สีพื้นหลังหลัก)
        surface: '#FFFFFF',   // White Card
      },
      // ✅ 3. Animation ที่เคยมี
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}