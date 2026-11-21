import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';
import './FoodCard.css';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    if (!food.available) return;
    const success = addToCart(food, 1);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  return (
    <div className={`food-card ${!food.available ? 'food-card-unavailable' : ''}`}>
      <div className="food-card-image-box">
        <img 
          src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'} 
          alt={food.name}
          className="food-card-img" 
          loading="lazy"
        />
        <div className="food-card-badges">
          <span className="food-badge-category">{food.category}</span>
          <span className={`badge ${food.available ? 'badge-success' : 'badge-danger'}`}>
            {food.available ? 'Available' : 'Sold Out'}
          </span>
        </div>
      </div>

      <div className="food-card-body">
        <h3 className="food-card-title">{food.name}</h3>
        <p className="food-card-desc">{food.description}</p>
        
        <div className="food-card-footer">
          <div className="food-card-price-box">
            <span className="price-label">Price</span>
            <span className="price-amount">₹{Number(food.price).toFixed(2)}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!food.available}
            className={`btn btn-sm ${justAdded ? 'btn-secondary' : 'btn-primary'} ${!food.available ? 'btn-disabled' : ''}`}
          >
            {justAdded ? (
              <>
                <Check size={16} /> Added!
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> {food.available ? 'Add to Cart' : 'Sold Out'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
