import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { createOrder } from '../services/api';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Receipt,
  CheckCircle2
} from 'lucide-react';
import './Cart.css';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotalAmount } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { refreshNotifications } = useNotifications();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  const handleUpdateQuantity = (foodId, delta, itemName) => {
    updateQuantity(foodId, delta);
    if (delta > 0) {
      showToast(`Increased ${itemName} quantity`, 'info');
    } else {
      showToast(`Decreased ${itemName} quantity`, 'info');
    }
  };

  const handleRemoveItem = (foodId, itemName) => {
    removeFromCart(foodId);
    showToast(`Removed "${itemName}" from cart`, 'info');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear all items in your cart?')) {
      clearCart();
      showToast('Cart cleared', 'info');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      showToast('Please sign in or select student mode to place an order.', 'error');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg('Your cart is empty. Add food items before checking out.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        userId: user.id,
        items: cartItems.map((item) => ({
          foodId: item.id,
          quantity: item.quantity,
        })),
      };

      const placedOrder = await createOrder(orderPayload);
      clearCart();
      setOrderConfirmed(placedOrder);
      showToast(`Order #${placedOrder.orderNumber} placed successfully!`, 'success');
      if (refreshNotifications) {
        refreshNotifications();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message ||
        'Failed to place order. Ensure food items are available and canteen service is running.'
      );
      showToast('Could not place order. Please review your cart.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // If order was just placed, display Order Confirmation View
  if (orderConfirmed) {
    return (
      <div className="container confirmation-wrapper">
        <div className="card confirmation-card">
          <div className="confirmation-icon-circle">
            <CheckCircle2 size={36} color="#FFFFFF" />
          </div>

          <span className="badge badge-success confirmation-badge">Order Confirmed</span>
          <h2 className="confirmation-heading">Your Food Order Has Been Placed!</h2>
          <p className="confirmation-sub">
            The canteen staff has received your order and started preparing your food.
          </p>

          <div className="order-receipt-box">
            <div className="receipt-row">
              <span className="receipt-label">Order Number:</span>
              <strong className="receipt-value receipt-order-no">{orderConfirmed.orderNumber}</strong>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Student Name:</span>
              <span className="receipt-value">{orderConfirmed.userName}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Status:</span>
              <span className="badge badge-accent">{orderConfirmed.status}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Total Amount Paid:</span>
              <strong className="receipt-value text-primary">₹{Number(orderConfirmed.totalAmount).toFixed(2)}</strong>
            </div>

            <div className="receipt-items-list">
              <span className="items-header">Ordered Items:</span>
              {orderConfirmed.items?.map((item) => (
                <div key={item.id} className="receipt-item-row">
                  <span>{item.foodName} × {item.quantity}</span>
                  <strong>₹{Number(item.subtotal).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="confirmation-action-buttons">
            <Link to={`/track/${orderConfirmed.orderNumber}`} className="btn btn-primary">
              <Clock size={16} /> Live Order Tracking
            </Link>
            <Link to="/orders" className="btn btn-outline">
              View Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header-row">
          <div>
            <h1 className="cart-page-title">Shopping Cart & Checkout</h1>
            <p className="cart-page-sub">Review items and place order for canteen pickup.</p>
          </div>
          <span className="cart-count-badge">
            {cartItems.length} {cartItems.length === 1 ? 'dish' : 'dishes'} in cart
          </span>
        </div>

        {errorMsg && (
          <div className="alert alert-danger">
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ShoppingBag size={28} />
            </div>
            <h3>Your Canteen Cart is Empty</h3>
            <p>
              Hungry between classes? Browse our delicious canteen breakfast, lunch meals, and quick snacks!
            </p>
            <Link to="/menu" className="btn btn-primary">
              Explore Canteen Menu <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* Left Items Column */}
            <div className="cart-items-column">
              <div className="cart-items-header-bar">
                <span>Food Item & Quantity</span>
                <span>Subtotal</span>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => {
                  const itemSubtotal = item.price * item.quantity;

                  return (
                    <div key={item.id} className="cart-item-card card">
                      <img
                        src={item.imageUrl || DEFAULT_IMAGE}
                        alt={item.name}
                        className="cart-item-thumb"
                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                      />

                      <div className="cart-item-details">
                        <span className="cart-item-category">{item.category}</span>
                        <h4 className="cart-item-name">{item.name}</h4>
                        <span className="cart-item-unit-price">₹{Number(item.price).toFixed(2)} each</span>

                        {/* Quantity Counter */}
                        <div className="cart-item-qty-row">
                          <div className="qty-counter-box">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, -1, item.name)}
                              className="qty-btn"
                              title="Decrease quantity"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="qty-number">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.id, 1, item.name)}
                              className="qty-btn"
                              title="Increase quantity"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="cart-item-remove-btn"
                            title="Remove item"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-subtotal-box">
                        <span className="subtotal-amount">₹{itemSubtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-actions-footer">
                <Link to="/menu" className="btn btn-outline btn-sm">
                  Add More Dishes
                </Link>
                <button type="button" onClick={handleClearCart} className="clear-cart-text-btn">
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Right Summary & Checkout Column */}
            <div className="cart-summary-column">
              <div className="card cart-summary-card">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-calc-list">
                  <div className="summary-calc-row">
                    <span>Items Subtotal</span>
                    <span className="calc-val">₹{cartTotalAmount.toFixed(2)}</span>
                  </div>
                  <div className="summary-calc-row">
                    <span>Canteen Packaging</span>
                    <span className="text-success font-semibold">FREE</span>
                  </div>
                  <div className="summary-calc-row">
                    <span>Student Convenience Fee</span>
                    <span className="text-success font-semibold">₹0.00</span>
                  </div>
                </div>

                <div className="summary-divider" />

                <div className="summary-total-row">
                  <div>
                    <span className="total-title">Total Amount</span>
                    <span className="total-tax-note">Inclusive of all college taxes</span>
                  </div>
                  <span className="total-amount-bold">₹{cartTotalAmount.toFixed(2)}</span>
                </div>

                {/* Student Notice */}
                <div className="student-order-notice">
                  <ShieldCheck size={18} className="shield-icon" />
                  <div>
                    <p className="notice-heading">Ordering as: <strong>{user?.name || 'Student'}</strong></p>
                    <p className="notice-body">Direct MySQL order dispatch. Collect at Counter #1.</p>
                  </div>
                </div>

                {/* Submit Checkout Button */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn btn-primary btn-lg place-order-btn"
                >
                  {loading ? (
                    'Processing Order...'
                  ) : (
                    <>
                      Confirm & Place Order (₹{cartTotalAmount.toFixed(2)}) <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
