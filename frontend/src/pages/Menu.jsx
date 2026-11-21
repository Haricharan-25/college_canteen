import React, { useState, useEffect } from 'react';
import { getFoods } from '../services/api';
import FoodCard from '../components/FoodCard';
import { Search, Filter, UtensilsCrossed, RefreshCw } from 'lucide-react';
import './Menu.css';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all, available

  useEffect(() => {
    loadFoodItems();
  }, [activeCategory]);

  const loadFoodItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory !== 'All') {
        params.category = activeCategory;
      }
      const data = await getFoods(params);
      setFoods(data);
    } catch (err) {
      console.error('Failed to load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchQuery(term);
    if (term.trim().length > 0) {
      try {
        const data = await getFoods({ search: term });
        setFoods(data);
      } catch (err) {
        console.error(err);
      }
    } else {
      loadFoodItems();
    }
  };

  // Filter client-side by availability if requested
  const filteredFoods = foods.filter((food) => {
    if (availabilityFilter === 'available') {
      return food.available === true;
    }
    return true;
  });

  return (
    <div className="menu-page">
      {/* Menu Header */}
      <div className="menu-header-bar">
        <div className="container">
          <div className="menu-header-flex">
            <div>
              <h1 className="menu-title">Campus Canteen Menu</h1>
              <p className="menu-sub">
                Hygienic, wholesome meals and beverages prepared with care.
              </p>
            </div>
            
            <div className="menu-quick-stats">
              <span className="stat-badge">
                <strong>{foods.length}</strong> Total Items
              </span>
              <span className="stat-badge stat-badge-avail">
                <strong>{foods.filter(f => f.available).length}</strong> Ready to Order
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container menu-content-container">
        {/* Controls Toolbar: Search, Category, Filter */}
        <div className="menu-toolbar card">
          <div className="menu-search-col">
            <div className="menu-search-wrapper">
              <Search size={18} className="search-icon-fixed" />
              <input
                type="text"
                placeholder="Search by dish name (e.g. Dosa, Chai, Biryani)..."
                value={searchQuery}
                onChange={handleSearch}
                className="menu-search-field"
              />
              {searchQuery && (
                <button
                  className="clear-text-btn"
                  onClick={() => { setSearchQuery(''); loadFoodItems(); }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="menu-filters-col">
            <div className="category-btn-group">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
                  className={`cat-pill-btn ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="avail-select-box">
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="avail-dropdown"
              >
                <option value="all">All Status</option>
                <option value="available">Available Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="menu-results-info">
          <span>
            Showing <strong>{filteredFoods.length}</strong> {activeCategory !== 'All' ? activeCategory : ''} items
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <button 
            className="btn btn-outline btn-sm refresh-btn"
            onClick={loadFoodItems}
            title="Refresh Menu"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <div className="center-box">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading menu items...</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <UtensilsCrossed size={30} />
            </div>
            <h3>No Food Items Found</h3>
            <p>
              We couldn't find any dishes under category "{activeCategory}" matching your criteria.
            </p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); setAvailabilityFilter('all'); }}
              className="btn btn-primary btn-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
