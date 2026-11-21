import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/api';
import { Coffee, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: 'rahul@college.edu',
    password: 'student123',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, switchToAdmin, switchToStudent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerUser(formData);
        login({
          id: res.id,
          name: res.name,
          email: res.email,
          role: res.role,
        });
      } else {
        const res = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        login({
          id: res.id,
          name: res.name,
          email: res.email,
          role: res.role,
        });
      }
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Authentication failed. Please check credentials or backend connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStudent = () => {
    switchToStudent();
    navigate('/');
  };

  const handleQuickAdmin = () => {
    switchToAdmin();
    navigate('/admin');
  };

  return (
    <div className="auth-page-container">
      <div className="card auth-card">
        <div className="auth-brand-center">
          <div className="auth-brand-icon">
            <Coffee size={28} color="#FFFFFF" />
          </div>
          <h2 className="auth-title">CampusBite Portal</h2>
          <p className="auth-sub">Online College Canteen Food Ordering System</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="rahul@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-control"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Canteen Staff / Admin</option>
              </select>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg auth-submit-btn">
            {loading ? 'Authenticating...' : isRegister ? 'Create College Account' : 'Sign In to CampusBite'}
          </button>
        </form>

        <div className="auth-toggle-mode">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegister(false)} className="link-button">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to the canteen?{' '}
              <button onClick={() => setIsRegister(true)} className="link-button">
                Register New Account
              </button>
            </p>
          )}
        </div>

        {/* Quick Demo Bypass for Academic Viva Evaluation */}
        <div className="quick-demo-section">
          <span className="demo-hint-title">Quick Demo 1-Click Login:</span>
          <div className="demo-actions-grid">
            <button onClick={handleQuickStudent} className="btn btn-outline btn-sm">
              <UserCheck size={14} /> Student Demo
            </button>
            <button onClick={handleQuickAdmin} className="btn btn-secondary btn-sm">
              <ShieldCheck size={14} /> Admin Staff Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
