import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFoods } from '../services/api';
import FoodCard from '../components/FoodCard';
import InstantOrderMarquee from '../components/InstantOrderMarquee';
import { FoodCardSkeleton } from '../components/Skeleton';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  UtensilsCrossed, 
  Utensils, 
  X,
  Filter
} from 'lucide-react';
import './Home.css';

const MENU_CATEGORIES = [
  { id: 'All', label: 'All Items' },
  { id: 'Breakfast', label: 'Breakfast' },
  { id: 'Lunch', label: 'Lunch' },
  { id: 'Snacks', label: 'Snacks' },
  { id: 'Beverages', label: 'Beverages' },
];

const Home = () => {
  const { user } = useAuth();
  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Filter foods for Section 2: Explore Our Menu
  const filteredFoods = allFoods.filter((food) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (food.category && food.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.description && food.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

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
              Welcome back, <strong>{user ? user.name : 'Student'}</strong>! Order your favourite meals ahead of break time, monitor live kitchen preparation, and collect your food without long queue delays.
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
                <span>Student Subsidized Pricing</span>
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
          SECTION 1: INSTANT ORDER — CONTINUOUS HORIZONTAL MOVEMENT (MARQUEE)
          Continuously moves right-to-left automatically. Pauses on hover.
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

      {/* =========================================================================
          SECTION 2: EXPLORE OUR MENU — COMPACT FOOD CARD GRID
          Normal compact grid: 4 cols desktop, 3 cols medium, 2 cols mobile.
          ========================================================================= */}
      <section className="menu-grid-section">
        <div className="container">
          {/* Menu Section Header */}
          <div className="menu-section-header">
            <div className="menu-header-text">
              <div className="section-title-with-badge">
                <UtensilsCrossed size={22} className="text-primary" />
                <h2 className="section-title">Explore Our Menu</h2>
              </div>
              <p className="section-subtitle">
                Select your meal category or search for dishes below.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="menu-search-box">
              <Search size={17} className="menu-search-icon" />
              <input
                type="text"
                placeholder="Search menu (e.g. Dosa, Chai, Biryani)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="menu-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="menu-clear-btn"
                  aria-label="Clear search text"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="menu-category-pills">
            {MENU_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`menu-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Summary Bar */}
          <div className="menu-results-count-bar">
            <span>
              Showing <strong>{filteredFoods.length}</strong> {selectedCategory !== 'All' ? selectedCategory : ''} items
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="btn btn-outline btn-sm reset-filter-btn"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Compact Food Card Grid */}
          {loading ? (
            <div className="compact-menu-grid">
              {Array.from({ length: 8 }).map((_, idx) => (
                <FoodCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredFoods.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Utensils size={28} />
              </div>
              <h3>No Food Items Found</h3>
              <p>
                We couldn't find any dishes under "{selectedCategory}" matching "{searchQuery}".
              </p>
              <button
                type="button"
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="btn btn-primary btn-sm"
              >
                Show All Menu Dishes
              </button>
            </div>
          ) : (
            <div className="compact-menu-grid">
              {filteredFoods.map((food) => (
                <div key={food.id} className="grid-card-cell">
                  <FoodCard food={food} compact={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
