import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ฟังก์ชันจำลองการล็อกอิน
  const login = (email, password) => {
    // 🔐 Mock Logic: เช็ค User / Password ตรงนี้
    if (password === '123456') {
      if (email.includes('admin')) {
        setUser({ name: 'Admin Boss', email, role: 'ADMIN' });
        return { success: true, role: 'ADMIN' };
      } else {
        setUser({ name: 'Somchai', email, role: 'MEMBER' });
        return { success: true, role: 'MEMBER' };
      }
    }
    return { success: false, error: 'รหัสผ่านผิด (ลองใช้ 123456)' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);