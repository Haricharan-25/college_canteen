import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShoppingBag, 
  UtensilsCrossed, 
  Clock, 
  Compass, 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu, 
  X,
  Coffee,
  ChevronDown,
  Layers,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, switchToAdmin, switchToStudent } = useAuth();
  const { totalItemsCount } = useCart();
  const { showToast } = useToast();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    showToast('You have been signed out successfully.', 'info');
    navigate('/login');
  };

  const handleRoleSwitch = (role) => {
    if (role === 'ADMIN') {
      switchToAdmin();
      showToast('Switched to Admin Staff View', 'info');
    } else {
      switchToStudent();
      showToast('Switched to Student View', 'info');
    }
  };

  return (
    <header className="navbar-wrapper">
      {/* Top Demo Bar */}
      <div className="demo-strip">
        <div className="container demo-strip-content">
          <div className="demo-info">
            <span className="demo-indicator-dot" />
            <span>
              Active Profile: <strong>{user ? `${user.name} (${user.role})` : 'Guest'}</strong>
            </span>
          </div>
          <div className="demo-toggle-buttons">
            <button 
              type="button"
              className={`demo-pill ${user?.role === 'STUDENT' ? 'active' : ''}`}
              onClick={() => handleRoleSwitch('STUDENT')}
            >
              Student View
            </button>
            <button 
              type="button"
              className={`demo-pill ${user?.role === 'ADMIN' ? 'active' : ''}`}
              onClick={() => handleRoleSwitch('ADMIN')}
            >
              Admin View
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar-main">
        <div className="container navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand">
            <div className="brand-logo-icon">
              <UtensilsCrossed size={20} color="#FFFFFF" />
            </div>
            <div className="brand-text">
              <span className="brand-name">CampusBite</span>
              <span className="brand-sub">College Canteen</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="nav-links-desktop">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Compass size={17} />
              Home
            </NavLink>
            <NavLink to="/menu" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <UtensilsCrossed size={17} />
              Menu
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Clock size={17} />
              My Orders
            </NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-item admin-link active' : 'nav-item admin-link'}>
                <ShieldCheck size={17} />
                Admin Panel
              </NavLink>
            )}
          </div>

          {/* Right Actions */}
          <div className="navbar-actions">
            {/* Theme Toggle (Light / Dark Mode) */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun size={18} className="theme-toggle-icon sun-icon" />
              ) : (
                <Moon size={18} className="theme-toggle-icon moon-icon" />
              )}
              <span className="theme-toggle-text">{isDark ? 'Light' : 'Dark'}</span>
            </button>

            {/* Cart Button */}
            <Link to="/cart" className="cart-button" title="View Shopping Cart">
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && (
                <span className="cart-badge">{totalItemsCount}</span>
              )}
            </Link>

            {/* Profile Dropdown or Sign In */}
            {user ? (
              <div className="profile-dropdown-wrapper" ref={dropdownRef}>
                <button
                  type="button"
                  className="profile-trigger-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="avatar-circle">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="profile-trigger-name">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`chevron-icon ${profileDropdownOpen ? 'open' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="profile-dropdown-menu card">
                    <div className="dropdown-user-header">
                      <strong className="dropdown-user-name">{user.name}</strong>
                      <span className="dropdown-user-email">{user.email}</span>
                      <span className={`badge ${user.role === 'ADMIN' ? 'badge-accent' : 'badge-primary'} role-tag`}>
                        {user.role === 'ADMIN' ? 'Canteen Staff / Admin' : 'College Student'}
                      </span>
                    </div>

                    <div className="dropdown-divider" />

                    <div className="dropdown-links">
                      <Link to="/orders" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                        <Clock size={16} /> My Orders & History
                      </Link>
                      <Link to="/menu" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                        <UtensilsCrossed size={16} /> Canteen Menu
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link to="/admin" className="dropdown-item admin-item" onClick={() => setProfileDropdownOpen(false)}>
                          <ShieldCheck size={16} /> Admin Operations Desk
                        </Link>
                      )}
                    </div>

                    <div className="dropdown-divider" />

                    <button type="button" onClick={handleLogout} className="dropdown-item logout-item">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button 
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-dropdown-menu">
            <div className="container mobile-menu-inner">
              <NavLink to="/" end className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <Compass size={18} /> Home
              </NavLink>
              <NavLink to="/menu" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <UtensilsCrossed size={18} /> Canteen Menu
              </NavLink>
              <NavLink to="/orders" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <Clock size={18} /> My Orders & Tracking
              </NavLink>
              <NavLink to="/cart" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingBag size={18} /> Cart ({totalItemsCount} items)
              </NavLink>
              {user?.role === 'ADMIN' && (
                <NavLink to="/admin" className="mobile-nav-link mobile-admin-link" onClick={() => setMobileMenuOpen(false)}>
                  <ShieldCheck size={18} /> Admin Dashboard
                </NavLink>
              )}

              {/* Mobile Theme Toggle */}
              <button
                type="button"
                className="mobile-nav-link mobile-theme-btn"
                onClick={toggleTheme}
              >
                {isDark ? <Sun size={18} className="theme-toggle-icon sun-icon" /> : <Moon size={18} className="theme-toggle-icon moon-icon" />}
                <span>Theme: <strong>{isDark ? 'Dark Mode (Active)' : 'Light Mode (Active)'}</strong></span>
              </button>

              <div className="mobile-divider" />

              {user ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <div className="avatar-circle">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <strong>{user.name}</strong>
                      <span className="mobile-email">{user.email}</span>
                    </div>
                  </div>
                  <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm mobile-logout-btn">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm mobile-signin-btn" onClick={() => setMobileMenuOpen(false)}>
                  Sign In to CampusBite
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
