import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FoodCard from './FoodCard';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import './CategoryScrollRow.css';

const CategoryScrollRow = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  foods = [], 
  categoryKey 
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [foods]);

  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 300; // approximately one card width + gap
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!foods || foods.length === 0) {
    return null;
  }

  return (
    <div className="category-scroll-section">
      {/* Category Section Header */}
      <div className="category-scroll-header">
        <div className="category-title-group">
          <div className="category-title-with-badge">
            {Icon && <Icon size={20} className="category-icon text-primary" />}
            <h3 className="category-scroll-title">{title}</h3>
            <span className="category-count-badge">{foods.length} items</span>
          </div>
          {subtitle && <p className="category-scroll-sub">{subtitle}</p>}
        </div>

        <div className="category-scroll-actions">
          <Link 
            to={`/menu?category=${encodeURIComponent(categoryKey || title)}`} 
            className="view-all-link"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>

          <div className="scroll-arrow-buttons">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`scroll-arrow-btn ${!canScrollLeft ? 'disabled' : ''}`}
              aria-label={`Scroll ${title} left`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`scroll-arrow-btn ${!canScrollRight ? 'disabled' : ''}`}
              aria-label={`Scroll ${title} right`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontally Scrollable Cards Container */}
      <div className="category-scroll-container" ref={scrollRef}>
        {foods.map((food) => (
          <div key={food.id} className="category-scroll-card-wrapper">
            <FoodCard food={food} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryScrollRow;
