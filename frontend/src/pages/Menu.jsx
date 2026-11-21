import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFoods } from '../services/api';
import FoodCard from '../components/FoodCard';
import { FoodCardSkeleton } from '../components/Skeleton';
import { Search, Filter, UtensilsCrossed, RefreshCw, X } from 'lucide-react';
import './Menu.css';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'];

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(
    categoryParam && CATEGORIES.includes(categoryParam) ? categoryParam : 'All'
  );
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all, available

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

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

  const handleClearSearch = () => {
    setSearchQuery('');
    loadFoodItems();
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setSearchQuery('');
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Filter client-side by availability if requested
  const filteredFoods = foods.filter((food) => {
    if (availabilityFilter === 'available') {
      return food.available === true;
    }
    return true;
  });

  const availableCount = foods.filter((f) => f.available).length;

  return (
    <div className="menu-page">
      {/* Menu Header Bar */}
      <div className="menu-header-bar">
        <div className="container">
          <div className="menu-header-flex">
            <div>
              <h1 className="menu-title">Campus Canteen Menu</h1>
              <p className="menu-sub">
                Hygienic, wholesome student meals and beverages prepared with care.
              </p>
            </div>
            
            <div className="menu-quick-stats">
              <span className="stat-badge">
                <strong>{foods.length}</strong> Total Dishes
              </span>
              <span className="stat-badge stat-badge-avail">
                <strong>{availableCount}</strong> Available Now
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container menu-content-container">
        {/* Controls Toolbar: Search, Category, Filter */}
        <div className="menu-toolbar card">
          <div className="menu-search-wrapper">
            <Search size={18} className="search-icon-fixed" />
            <input
              type="text"
              placeholder="Search dishes by name (e.g. Masala Dosa, Chai, Dum Biryani)..."
              value={searchQuery}
              onChange={handleSearch}
              className="menu-search-field"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-text-btn"
                onClick={handleClearSearch}
                aria-label="Clear search text"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="menu-filters-col">
            <div className="category-btn-group">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
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
                <option value="all">All Dishes</option>
                <option value="available">Available Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info & Refresh */}
        <div className="menu-results-info">
          <span>
            Showing <strong>{filteredFoods.length}</strong> {activeCategory !== 'All' ? activeCategory : ''} items
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <button 
            type="button"
            className="btn btn-outline btn-sm refresh-btn"
            onClick={loadFoodItems}
            title="Refresh Menu"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* 3-Column Card Layout: [card][card][card] */}
        {loading ? (
          <div className="food-grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <FoodCardSkeleton key={idx} />
            ))}
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <UtensilsCrossed size={28} />
            </div>
            <h3>No Food Items Found</h3>
            <p>
              We couldn't find any dishes under category "{activeCategory}" matching your criteria.
            </p>
            <button
              type="button"
              onClick={() => { handleCategorySelect('All'); setSearchQuery(''); setAvailabilityFilter('all'); }}
              className="btn btn-primary btn-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFoods.map((food) => (
              <div key={food.id} className="menu-card-cell">
                <FoodCard food={food} compact={false} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
