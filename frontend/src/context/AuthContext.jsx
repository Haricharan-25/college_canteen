import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // If user has saved session in localStorage, load it.
  // If user explicitly logged out, keep logged out.
  // Otherwise, default to pre-seeded Student "Rahul Sharma" for zero-friction demo.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusbite_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const loggedOut = localStorage.getItem('campusbite_logged_out');
    if (loggedOut === 'true') {
      return null;
    }
    return {
      id: 2,
      name: 'Rahul Sharma',
      email: 'rahul@college.edu',
      role: 'STUDENT',
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('campusbite_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campusbite_user');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('campusbite_user', JSON.stringify(userData));
    localStorage.removeItem('campusbite_logged_out');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusbite_user');
    localStorage.setItem('campusbite_logged_out', 'true');
  };

  const switchToAdmin = () => {
    login({
      id: 1,
      name: 'Admin Canteen Staff',
      email: 'admin@canteen.com',
      role: 'ADMIN',
    });
  };

  const switchToStudent = () => {
    login({
      id: 2,
      name: 'Rahul Sharma',
      email: 'rahul@college.edu',
      role: 'STUDENT',
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchToAdmin, switchToStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
