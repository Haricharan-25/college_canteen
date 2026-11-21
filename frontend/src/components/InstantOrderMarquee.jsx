import React from 'react';
import FoodCard from './FoodCard';
import { Zap } from 'lucide-react';
import './InstantOrderMarquee.css';

const InstantOrderMarquee = ({ foods = [] }) => {
  if (!foods || foods.length === 0) {
    return null;
  }

  // Build a seamless infinite sequence by duplicating the items
  // Ensure we have at least 8 items in the base set, then duplicate once (Set A + Set B)
  // When translateX reaches -50%, Set A has fully exited and Set B is in exact position 0,
  // creating an infinite, seamless loop without any visible gap or jump.
  let baseSet = [...foods];
  while (baseSet.length < 8 && foods.length > 0) {
    baseSet = [...baseSet, ...foods];
  }
  const marqueeList = [...baseSet, ...baseSet];

  return (
    <section className="instant-order-section">
      <div className="container">
        {/* Section Heading */}
        <div className="instant-order-header">
          <div className="instant-order-title-group">
            <div className="section-title-with-badge">
              <Zap size={22} className="text-primary icon-zap" />
              <h2 className="section-title">Instant Order</h2>
            </div>
            <p className="section-subtitle">Your favourite campus meals, just a click away.</p>
          </div>
          <span className="marquee-status-badge">
            <span className="status-dot" /> Auto-Showcase
          </span>
        </div>
      </div>

      {/* Continuously Moving Horizontal Showcase */}
      <div 
        className="marquee-showcase-wrapper"
        title="Hover to pause showcase"
        aria-label="Continuously moving instant order food showcase"
      >
        <div className="marquee-track">
          {marqueeList.map((food, index) => (
            <div key={`${food.id}-${index}`} className="marquee-card-slot">
              <FoodCard food={food} compact={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstantOrderMarquee;
