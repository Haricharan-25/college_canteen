import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Check, Flame } from 'lucide-react';
import { getFoodBadges } from '../utils/foodBadges';
import './FoodCard.css';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

const FoodCard = ({ food, compact = false }) => {
  const { addToCart, cartItems } = useCart();
  const { showToast } = useToast();
  const [justAdded, setJustAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(food.imageUrl || DEFAULT_IMAGE);

  // Check if this food item is currently in the cart
  const itemInCart = cartItems.find((item) => item.id === food.id);
  const cartQuantity = itemInCart ? itemInCart.quantity : 0;

  // Compute deterministic food badges based on actual data
  const { highlightBadge, dietaryBadge, spiceBadge, availabilityBadge } = getFoodBadges(food);

  const handleAddToCart = () => {
    if (!food.available) {
      showToast(`Sorry, "${food.name}" is currently sold out.`, 'error');
      return;
    }
    const success = addToCart(food, 1);
    if (success) {
      setJustAdded(true);
      showToast(`Added ${food.name} to your cart!`, 'success');
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  return (
    <div className={`food-card ${compact ? 'food-card-compact' : ''} ${!food.available ? 'food-card-unavailable' : ''}`}>
      {/* Food Image Container */}
      <div className="food-card-image-box">
        <img 
          src={imgSrc} 
          alt={food.name}
          className="food-card-img" 
          loading="lazy"
          onError={() => setImgSrc(DEFAULT_IMAGE)}
        />
        
        {/* Badges Overlay */}
        <div className="food-card-badges">
          <div className="badges-group-left">
            {highlightBadge && (
              <span className={`food-tag-badge badge-${highlightBadge.type}`}>
                {highlightBadge.label}
              </span>
            )}
            <span className="food-badge-category">{food.category}</span>
          </div>

          <div className="badges-group-right">
            <span className={`food-tag-badge badge-${dietaryBadge.type}`} title={dietaryBadge.label}>
              <span className={`dietary-dot dietary-${dietaryBadge.type}`} />
              <span>{dietaryBadge.label}</span>
            </span>

            {spiceBadge && !compact && (
              <span className="food-tag-badge badge-spicy" title="Spicy Dish">
                <Flame size={10} />
                <span>Spicy</span>
              </span>
            )}

            <span className={`food-tag-badge badge-${availabilityBadge.type}`}>
              {availabilityBadge.label}
            </span>
          </div>
        </div>

        {/* In-Cart Tag if already present */}
        {cartQuantity > 0 && (
          <div className="in-cart-indicator">
            In Cart: {cartQuantity}
          </div>
        )}
      </div>

      {/* Food Card Body */}
      <div className="food-card-body">
        <h3 className="food-card-title" title={food.name}>
          {food.name}
        </h3>
        <p className="food-card-desc" title={food.description}>
          {food.description || 'Freshly prepared canteen delicacy made to order.'}
        </p>
        
        {/* Footer with Price and Add to Cart Button */}
        <div className="food-card-footer">
          <div className="food-card-price-box">
            <span className="price-label">Price</span>
            <span className="price-amount">₹{Number(food.price).toFixed(2)}</span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!food.available}
            className={`btn btn-sm ${justAdded ? 'btn-success' : 'btn-primary'} ${!food.available ? 'btn-disabled' : ''}`}
            aria-label={food.available ? `Add ${food.name} to cart` : `${food.name} is sold out`}
          >
            {justAdded ? (
              <>
                <Check size={14} /> Added!
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> {food.available ? 'Add to Cart' : 'Sold Out'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
