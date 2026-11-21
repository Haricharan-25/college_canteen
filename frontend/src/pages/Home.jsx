import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFoods } from '../services/api';
import FoodCard from '../components/FoodCard';
import { FoodCardSkeleton } from '../components/Skeleton';
import { 
  Search, 
  ArrowRight, 
  Flame, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Coffee,
  CheckCircle2,
  Utensils,
  X
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

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchFoodItems();
  };

  return (
    <div className="home-page">
      {/* Hero Welcome Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="badge badge-primary hero-badge">
              <Sparkles size={13} /> College Canteen Ordering
            </span>
            <h1 className="hero-title">
              Skip The Long Queues. Order Fresh Food Online.
            </h1>
            <p className="hero-subtitle">
              Welcome, <strong>{user ? user.name : 'Student'}</strong>! Browse freshly prepared meals, track your order's live kitchen status, and collect your food without waiting in break-time queues.
            </p>

            {/* Quick Search Bar */}
            <div className="hero-search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search food by name (e.g. Masala Dosa, Biryani, Chai)..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  type="button"
                  className="clear-search-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="hero-quick-features">
              <div className="feature-item">
                <CheckCircle2 size={15} className="feature-check" />
                <span>Real-Time Kitchen Tracking</span>
              </div>
              <div className="feature-item">
                <CheckCircle2 size={15} className="feature-check" />
                <span>Zero Break Queue Delay</span>
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
                <span className="badge badge-accent">Peak Lunch Break</span>
                <span className="hero-time">12:30 PM – 2:00 PM</span>
              </div>
              <h3 className="hero-banner-heading">Chef's Specials Prepared Fresh Every Morning</h3>
              <p className="hero-banner-text">
                Crispy Dosas, Steaming Dum Biryani, and Hot Filter Coffee ready at Counter #1.
              </p>
              <div className="hero-card-footer">
                <Link to="/menu" className="btn btn-primary btn-sm">
                  Explore Full Menu <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Navigation */}
      <section className="category-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Browse By Category</h2>
              <p className="section-desc">Select a category to view fresh available dishes.</p>
            </div>
          </div>

          <div className="category-pills-row">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
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

      {/* Food Items Grid Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-title-with-icon">
                <Flame size={20} className="text-accent" />
                <h2 className="section-title">
                  {selectedCategory === 'All' ? 'Popular & Featured Canteen Bites' : `${selectedCategory} Menu`}
                </h2>
              </div>
              <p className="section-desc">Freshly prepared everyday for students and campus staff.</p>
            </div>
            <Link to="/menu" className="btn btn-outline btn-sm">
              See All Items ({foods.length})
            </Link>
          </div>

          {loading ? (
            <div className="food-grid">
              {Array.from({ length: 6 }).map((_, idx) => (
                <FoodCardSkeleton key={idx} />
              ))}
            </div>
          ) : foods.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Utensils size={28} />
              </div>
              <h3>No Food Items Found</h3>
              <p>We couldn't find any food items matching "{searchQuery}". Try searching for another dish.</p>
              <button 
                type="button"
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
