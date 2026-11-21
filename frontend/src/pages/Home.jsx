import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFoods } from '../services/api';
import FoodCard from '../components/FoodCard';
import CategoryScrollRow from '../components/CategoryScrollRow';
import { FoodCardSkeleton } from '../components/Skeleton';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  Coffee,
  CheckCircle2,
  Utensils,
  Sun,
  Cookie,
  CupSoda,
  Zap,
  X
} from 'lucide-react';
import './Home.css';

const CATEGORIES = [
  { name: 'All', label: 'All Categories' },
  { name: 'Breakfast', label: 'Breakfast', icon: Sun, subtitle: 'Start your college day with hot, crisp breakfast' },
  { name: 'Lunch', label: 'Lunch', icon: Utensils, subtitle: 'Hearty thalis, biryanis, and satisfying meal combos' },
  { name: 'Snacks', label: 'Snacks', icon: Cookie, subtitle: 'Quick bites, sandwiches, and break-time cravings' },
  { name: 'Beverages', label: 'Beverages', icon: Coffee, subtitle: 'Refreshing coolers, shakes, and filter coffee' },
];

const MAIN_CATEGORIES = ['Breakfast', 'Lunch', 'Snacks', 'Beverages'];

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Filter foods based on search query
  const searchResults = searchQuery.trim().length > 0 
    ? allFoods.filter((f) => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  // Group foods by category
  const getFoodsByCategory = (categoryName) => {
    return allFoods.filter(
      (f) => f.category && f.category.toLowerCase() === categoryName.toLowerCase()
    );
  };

  // Which categories to display
  const categoriesToRender = selectedCategory === 'All' 
    ? MAIN_CATEGORIES 
    : [selectedCategory];

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

      {/* Category Pills Quick Filter */}
      <section className="category-section">
        <div className="container">
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

      {/* Main Food Browsing: Instant Order Section */}
      <section className="instant-order-section">
        <div className="container">
          {/* Main Section Heading */}
          <div className="instant-order-header">
            <div className="section-title-with-badge">
              <Zap size={22} className="text-primary icon-zap" />
              <h2 className="section-title">Instant Order</h2>
            </div>
            <p className="section-subtitle">Find your favourites and order instantly.</p>
          </div>

          {/* Conditional Rendering: Loading State */}
          {loading ? (
            <div className="category-scroll-skeleton-wrapper">
              {Array.from({ length: 2 }).map((_, rIdx) => (
                <div key={rIdx} className="category-scroll-section">
                  <div className="skeleton-box skeleton-title-bar" />
                  <div className="category-scroll-container">
                    {Array.from({ length: 4 }).map((_, cIdx) => (
                      <div key={cIdx} className="category-scroll-card-wrapper">
                        <FoodCardSkeleton />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.trim().length > 0 ? (
            /* Search Results Display */
            <div className="search-results-section">
              <div className="search-results-header">
                <h3>
                  Search Results for "{searchQuery}" 
                  <span className="search-count-pill">{searchResults.length} found</span>
                </h3>
                <button 
                  type="button" 
                  onClick={handleClearSearch} 
                  className="btn btn-outline btn-sm"
                >
                  Clear Search
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Utensils size={28} />
                  </div>
                  <h3>No Food Items Found</h3>
                  <p>We couldn't find any dish matching "{searchQuery}". Try searching for another meal or beverage.</p>
                  <button 
                    type="button" 
                    onClick={handleClearSearch} 
                    className="btn btn-primary btn-sm"
                  >
                    View All Items
                  </button>
                </div>
              ) : (
                <div className="category-scroll-container">
                  {searchResults.map((food) => (
                    <div key={food.id} className="category-scroll-card-wrapper">
                      <FoodCard food={food} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Horizontally Scrollable Categories (Breakfast, Lunch, Snacks, Beverages) */
            <div className="category-sections-list">
              {categoriesToRender.map((catName) => {
                const catMeta = CATEGORIES.find((c) => c.name === catName) || {};
                const catFoods = getFoodsByCategory(catName);

                return (
                  <CategoryScrollRow
                    key={catName}
                    title={catName}
                    subtitle={catMeta.subtitle}
                    icon={catMeta.icon}
                    foods={catFoods}
                    categoryKey={catName}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
