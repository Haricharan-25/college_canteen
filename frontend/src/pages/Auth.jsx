import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginUser, registerUser } from '../services/api';
import { Coffee, ShieldCheck, UserCheck, AlertCircle, UtensilsCrossed } from 'lucide-react';
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
  const { showToast } = useToast();
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
        showToast(`Welcome to CampusBite, ${res.name}! Account created.`, 'success');
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
        showToast(`Signed in successfully as ${res.name}`, 'success');
      }
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Authentication failed. Please check your credentials.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStudent = () => {
    switchToStudent();
    showToast('Signed in as Demo Student (Rahul Sharma)', 'info');
    navigate('/');
  };

  const handleQuickAdmin = () => {
    switchToAdmin();
    showToast('Signed in as Canteen Admin Staff', 'info');
    navigate('/admin');
  };

  return (
    <div className="auth-page-container">
      <div className="card auth-card">
        <div className="auth-brand-center">
          <div className="auth-brand-icon">
            <UtensilsCrossed size={26} color="#FFFFFF" />
          </div>
          <h2 className="auth-title">CampusBite</h2>
          <p className="auth-sub">Online College Canteen Food Ordering Portal</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">College Email Address *</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="e.g. rahul@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
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

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary btn-lg auth-submit-btn"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create College Account' : 'Sign In to CampusBite'}
          </button>
        </form>

        <div className="auth-toggle-mode">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                  setFormData({ name: '', email: 'rahul@college.edu', password: 'student123', role: 'STUDENT' });
                }}
                className="link-button"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to the canteen?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                  setFormData({ name: '', email: '', password: '', role: 'STUDENT' });
                }}
                className="link-button"
              >
                Register New Account
              </button>
            </p>
          )}
        </div>

        {/* Quick Demo 1-Click Login Section */}
        <div className="quick-demo-section">
          <span className="demo-hint-title">1-Click Demo Evaluation Profiles:</span>
          <div className="demo-actions-grid">
            <button type="button" onClick={handleQuickStudent} className="btn btn-outline btn-sm">
              <UserCheck size={14} /> Student Demo
            </button>
            <button type="button" onClick={handleQuickAdmin} className="btn btn-secondary btn-sm">
              <ShieldCheck size={14} /> Admin Staff Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
