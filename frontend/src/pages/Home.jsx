import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFoods } from '../services/api';
import InstantOrderMarquee from '../components/InstantOrderMarquee';
import { FoodCardSkeleton } from '../components/Skeleton';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllFoodItems();
  }, []);

  const fetchAllFoodItems = async () => {
    setLoading(true);
    try {
      const data = await getFoods();
      setAllFoods(data);
    } catch (err) {
      console.error('Failed to load foods:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Top Welcome / Hero Banner */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="badge badge-primary hero-badge">
              <Sparkles size={13} /> Smart College Canteen
            </span>
            <h1 className="hero-title">
              Skip The Queue. Order Online, Pick Up Fresh.
            </h1>
            <p className="hero-subtitle">
              Welcome, <strong>{user ? user.name : 'Student'}</strong>! Browse freshly prepared meals, track your order's live kitchen status, and collect your food without break-time queue delays.
            </p>

            <div className="hero-quick-features">
              <div className="feature-item">
                <CheckCircle2 size={15} className="feature-check" />
                <span>Live Kitchen Tracking</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 size={15} className="feature-check" />
                <span>Zero Break Delays</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 size={15} className="feature-check" />
                <span>Subsidized Student Pricing</span>
              </div>
            </div>
          </div>

          <div className="hero-banner-visual">
            <div className="hero-feature-card card">
              <div className="hero-feature-header">
                <span className="badge badge-accent">Lunch Rush Ready</span>
                <span className="hero-time">Counter #1 Open</span>
              </div>
              <h3 className="hero-banner-heading">Chef's Fresh Specials Prepared Everyday</h3>
              <p className="hero-banner-text">
                Crispy Masala Dosas, Steaming Dum Biryani, and Hot Filter Coffee prepared to order.
              </p>
              <div className="hero-card-footer">
                <Link to="/menu" className="btn btn-primary btn-sm">
                  View Full Menu <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: INSTANT ORDER — CONTINUOUS HORIZONTAL MOVEMENT
          Items move continuously according to their category (Breakfast, Lunch, Snacks, Beverages)
          ========================================================================= */}
      {loading ? (
        <section className="instant-order-section">
          <div className="container">
            <div className="skeleton-box" style={{ width: '220px', height: '28px', marginBottom: '1.25rem' }} />
            <div style={{ display: 'flex', gap: '1.25rem', overflow: 'hidden' }}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} style={{ flex: '0 0 250px' }}>
                  <FoodCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <InstantOrderMarquee foods={allFoods} />
      )}
    </div>
  );
};

export default Home;
