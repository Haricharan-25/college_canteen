import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import './FloatingCartBar.css';

const FloatingCartBar = () => {
  const { totalItemsCount, cartTotalAmount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide floating cart on /cart itself or admin workspace
  if (
    totalItemsCount <= 0 ||
    location.pathname === '/cart' ||
    location.pathname.startsWith('/admin')
  ) {
    return null;
  }

  return (
    <aside className="floating-cart-anchor" aria-label="Floating Cart Summary">
      <div className="container floating-cart-container">
        <div className="floating-cart-bar">
          {/* Left: Cart Icon, Items Count, and Total Amount */}
          <div className="floating-cart-left">
            <div className="floating-cart-icon-circle">
              <ShoppingBag size={20} />
              <span className="floating-cart-counter">{totalItemsCount}</span>
            </div>

            <div className="floating-cart-details">
              <span className="floating-cart-items-text">
                {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}
              </span>
              <span className="floating-cart-divider">|</span>
              <span className="floating-cart-price">
                ₹{Number(cartTotalAmount || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Right: Prominent View Cart Button */}
          <div className="floating-cart-right">
            <button
              type="button"
              className="btn btn-primary floating-cart-btn"
              onClick={() => navigate('/cart')}
              aria-label="View shopping cart"
            >
              <span>View Cart</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FloatingCartBar;
