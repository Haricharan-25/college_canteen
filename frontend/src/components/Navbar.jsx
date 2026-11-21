import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
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
  Coffee
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, switchToAdmin, switchToStudent } = useAuth();
  const { totalItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-wrapper">
      {/* Top Banner Notice for Quick College Demo Role Toggling */}
      <div className="demo-strip">
        <div className="container demo-strip-content">
          <span>
            Current mode: <strong>{user ? `${user.name} (${user.role})` : 'Not signed in'}</strong>
          </span>
          <div className="demo-toggle-buttons">
            <button 
              className={`demo-pill ${user?.role === 'STUDENT' ? 'active' : ''}`}
              onClick={switchToStudent}
            >
              Student View
            </button>
            <button 
              className={`demo-pill ${user?.role === 'ADMIN' ? 'active' : ''}`}
              onClick={switchToAdmin}
            >
              Admin View
            </button>
          </div>
        </div>
      </div>

      <nav className="navbar-main">
        <div className="container navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand">
            <div className="brand-logo-icon">
              <Coffee size={22} color="#FFFFFF" />
            </div>
            <div className="brand-text">
              <span className="brand-name">CampusBite</span>
              <span className="brand-sub">College Canteen</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="nav-links-desktop">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Compass size={18} />
              Home
            </NavLink>
            <NavLink to="/menu" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <UtensilsCrossed size={18} />
              Menu
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Clock size={18} />
              My Orders
            </NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-item admin-link active' : 'nav-item admin-link'}>
                <ShieldCheck size={18} />
                Admin Panel
              </NavLink>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="navbar-actions">
            {/* Cart Icon */}
            <Link to="/cart" className="cart-button" title="View Cart">
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && (
                <span className="cart-badge">{totalItemsCount}</span>
              )}
            </Link>

            {/* User Profile / Status */}
            {user ? (
              <div className="user-profile-menu">
                <div className="user-avatar-tag">
                  <User size={16} />
                  <span className="user-display-name">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline btn-sm logout-btn" 
                  title="Logout"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button 
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-dropdown-menu">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Home
            </Link>
            <Link to="/menu" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Food Menu
            </Link>
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              Shopping Cart ({totalItemsCount})
            </Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link">
              My Orders & Tracking
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link mobile-admin-link">
                Admin Panel
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
