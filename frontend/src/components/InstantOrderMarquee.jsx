import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FoodCard from './FoodCard';
import { 
  Zap, 
  Sun, 
  Utensils, 
  Cookie, 
  Coffee, 
  ArrowRight 
} from 'lucide-react';
import './InstantOrderMarquee.css';

const CATEGORIES_CONFIG = [
  { id: 'All', label: 'All Categories' },
  { id: 'Breakfast', label: 'Breakfast', icon: Sun, subtitle: 'Hot morning dosas, idlis & breakfast meals' },
  { id: 'Lunch', label: 'Lunch', icon: Utensils, subtitle: 'Hearty thalis, biryanis & delicious combo platters' },
  { id: 'Snacks', label: 'Snacks', icon: Cookie, subtitle: 'Crispy samosas, rolls, sandwiches & canteen bites' },
  { id: 'Beverages', label: 'Beverages', icon: Coffee, subtitle: 'Chilled lassi, shakes, cold coffee & masala chai' },
];

const CATEGORY_NAMES = ['Breakfast', 'Lunch', 'Snacks', 'Beverages'];

// Sub-component for an individual category moving marquee row
const CategoryMarqueeRow = ({ title, subtitle, icon: Icon, foods = [] }) => {
  if (!foods || foods.length === 0) {
    return null;
  }

  // Duplicate items to create an infinite seamless loop
  let baseSet = [...foods];
  while (baseSet.length < 6 && foods.length > 0) {
    baseSet = [...baseSet, ...foods];
  }
  const marqueeList = [...baseSet, ...baseSet];

  return (
    <div className="category-marquee-row-block">
      {/* Category Row Header */}
      <div className="container">
        <div className="category-row-header">
          <div className="category-row-title-box">
            <div className="category-title-with-icon">
              {Icon && <Icon size={18} className="text-primary cat-icon" />}
              <h3 className="category-row-title">{title}</h3>
              <span className="category-row-count">{foods.length} items</span>
            </div>
            {subtitle && <p className="category-row-sub">{subtitle}</p>}
          </div>

          <Link 
            to={`/menu?category=${encodeURIComponent(title)}`} 
            className="category-view-menu-link"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Continuously Moving Showcase Track for this Category */}
      <div 
        className="marquee-showcase-wrapper"
        title="Hover anywhere to pause movement"
        aria-label={`${title} continuously moving food showcase`}
      >
        <div className="marquee-track">
          {marqueeList.map((food, index) => (
            <div key={`${food.id}-${index}`} className="marquee-card-slot">
              <FoodCard food={food} compact={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InstantOrderMarquee = ({ foods = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter foods by category
  const getFoodsByCategory = (catName) => {
    return foods.filter(
      (f) => f.category && f.category.toLowerCase() === catName.toLowerCase()
    );
  };

  const categoriesToShow = activeCategory === 'All'
    ? CATEGORY_NAMES
    : [activeCategory];

  return (
    <section className="instant-order-section">
      <div className="container">
        {/* Main Instant Order Heading */}
        <div className="instant-order-header">
          <div className="instant-order-title-group">
            <div className="section-title-with-badge">
              <Zap size={22} className="text-primary icon-zap" />
              <h2 className="section-title">Instant Order</h2>
            </div>
            <p className="section-subtitle">Your favourite campus meals, just a click away.</p>
          </div>

          {/* Category Filter Pills to control what moves */}
          <div className="instant-order-cat-pills">
            {CATEGORIES_CONFIG.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`instant-cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Moving Marquee Rows Grouped According to Their Category */}
      <div className="instant-order-rows-container">
        {categoriesToShow.map((catName) => {
          const config = CATEGORIES_CONFIG.find((c) => c.id === catName) || {};
          const catFoods = getFoodsByCategory(catName);

          return (
            <CategoryMarqueeRow
              key={catName}
              title={catName}
              subtitle={config.subtitle}
              icon={config.icon}
              foods={catFoods}
            />
          );
        })}
      </div>
    </section>
  );
};

export default InstantOrderMarquee;
