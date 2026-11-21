import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFoods } from '../services/api';
import FoodCard from '../components/FoodCard';
import { 
  Search, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Coffee,
  CheckCircle2,
  Utensils
} from 'lucide-react';
import './Home.css';

const CATEGORIES = [
  { name: 'All', label: 'All Items' },
  { name: 'Breakfast', label: 'Breakfast' },
  { name: 'Lunch', label: 'Lunch' },
  { name: 'Snacks', label: 'Snacks' },
  { name: 'Beverages', label: 'Beverages' },
];

const Home = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchFoodItems();
  }, [selectedCategory]);

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      const data = await getFoods(params);
      setFoods(data);
    } catch (err) {
      console.error('Failed to load foods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      try {
        const data = await getFoods({ search: query });
        setFoods(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      fetchFoodItems();
    }
  };

  const popularFoods = foods.slice(0, 4);

  return (
    <div className="home-page">
      {/* Hero Welcome Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="badge badge-primary hero-badge">
              <Sparkles size={14} /> Smart College Dining
            </span>
            <h1 className="hero-title">
              Skip The Canteen Queue. Order Food Online, Pick Up Fresh.
            </h1>
            <p className="hero-subtitle">
              Welcome back, <strong>{user ? user.name : 'Student'}</strong>! Browse freshly prepared meals, track real-time kitchen preparation, and collect your food without waiting in rush-hour queues.
            </p>

            {/* Quick Search Bar */}
            <div className="hero-search-bar">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search dosa, biryani, coffee, sandwiches..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => { setSearchQuery(''); fetchFoodItems(); }}
                >
                  Clear
                </button>
              )}
            </div>

            <div className="hero-quick-features">
              <div className="feature-item">
                <CheckCircle2 size={16} className="feature-check" />
                <span>Live Kitchen Tracking</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 size={16} className="feature-check" />
                <span>Zero Queue Waiting</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 size={16} className="feature-check" />
                <span>Affordable Student Pricing</span>
              </div>
            </div>
          </div>

          <div className="hero-banner-visual">
            <div className="hero-feature-card">
              <div className="hero-feature-header">
                <span className="badge badge-accent">Peak Lunch Hours</span>
                <span className="hero-time">12:30 PM - 2:00 PM</span>
              </div>
              <h3 className="hero-banner-heading">Today's Chef Specials Ready In 5 Mins</h3>
              <p className="hero-banner-text">Hot South Indian Dosa & Fresh Dum Biryani ready at Counter #2.</p>
              <Link to="/menu" className="btn btn-primary btn-sm">
                View Full Menu <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Navigation */}
      <section className="category-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Explore Food Categories</h2>
              <p className="section-desc">Select your desired meal category to view fresh available dishes.</p>
            </div>
          </div>

          <div className="category-pills-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => { setSelectedCategory(cat.name); setSearchQuery(''); }}
                className={`category-pill ${selectedCategory === cat.name ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Popular Food Items Grid */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-title-with-icon">
                <Flame size={22} className="text-accent" />
                <h2 className="section-title">Popular & Featured Canteen Bites</h2>
              </div>
              <p className="section-desc">Student favorites freshly prepared everyday.</p>
            </div>
            <Link to="/menu" className="btn btn-outline btn-sm">
              See All Items ({foods.length})
            </Link>
          </div>

          {loading ? (
            <div className="center-box">
              <div className="loading-spinner"></div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading delicious food...</p>
            </div>
          ) : foods.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Utensils size={32} />
              </div>
              <h3>No food items found</h3>
              <p>We couldn't find any food items matching "{searchQuery}". Try searching for another dish.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="btn btn-primary btn-sm"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="food-grid">
              {foods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
