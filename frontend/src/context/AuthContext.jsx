import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default to pre-seeded Student "Rahul Sharma" for seamless zero-friction college demo,
  // while allowing instant switching to Admin or custom accounts.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campusbite_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
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
  };

  const logout = () => {
    setUser(null);
  };

  const switchToAdmin = () => {
    setUser({
      id: 1,
      name: 'Admin Canteen Staff',
      email: 'admin@canteen.com',
      role: 'ADMIN',
    });
  };

  const switchToStudent = () => {
    setUser({
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
