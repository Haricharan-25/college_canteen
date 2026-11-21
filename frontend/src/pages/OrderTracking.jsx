import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderByNumber, getOrderById } from '../services/api';
import OrderTracker from '../components/OrderTracker';
import { 
  ArrowLeft, 
  Receipt, 
  Calendar, 
  User, 
  RefreshCw, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './OrderTracking.css';

const OrderTracking = () => {
  const { orderIdentifier } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
    // Auto-poll status every 5 seconds to provide real-time updates when admin changes status
    const interval = setInterval(() => {
      fetchOrderDetails(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [orderIdentifier]);

  const fetchOrderDetails = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setRefreshing(true);

    try {
      let data;
      // If identifier starts with "CB-", query by orderNumber, otherwise by numeric id
      if (orderIdentifier.startsWith('CB-')) {
        data = await getOrderByNumber(orderIdentifier);
      } else {
        data = await getOrderById(orderIdentifier);
      }
      setOrder(data);
      setError('');
    } catch (err) {
      if (!isBackground) {
        setError('Order could not be found. Please check your order reference number.');
      }
    } finally {
      if (!isBackground) setLoading(false);
      else setRefreshing(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="tracking-page">
      <div className="container">
        <div className="tracking-back-row">
          <Link to="/orders" className="back-link">
            <ArrowLeft size={16} /> Back to My Orders
          </Link>

          <button 
            onClick={() => fetchOrderDetails(false)} 
            className="btn btn-outline btn-sm refresh-status-btn"
          >
            <RefreshCw size={14} className={refreshing ? 'spin-icon' : ''} /> Check Status Now
          </button>
        </div>

        {loading ? (
          <div className="center-box">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Retrieving live order status...</p>
          </div>
        ) : error ? (
          <div className="card tracking-error-card">
            <AlertCircle size={40} className="error-icon" />
            <h2>Order Not Found</h2>
            <p>{error}</p>
            <Link to="/orders" className="btn btn-primary btn-sm">
              View All Orders
            </Link>
          </div>
        ) : order ? (
          <div className="tracking-content-wrapper">
            {/* Top Order Heading Card */}
            <div className="card tracking-header-card">
              <div className="tracking-header-top">
                <div>
                  <span className="order-tag">Canteen Food Order</span>
                  <h1 className="order-code-display">{order.orderNumber}</h1>
                  <span className="order-timestamp">
                    <Calendar size={14} /> Placed on: {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="order-status-highlight">
                  <span className="status-label">Current Status</span>
                  <span className="badge badge-primary status-badge-lg">{order.status}</span>
                </div>
              </div>

              {/* Graphical Step-by-step Progress Tracker */}
              <OrderTracker status={order.status} />

              {/* Status explanation */}
              <div className="status-info-banner">
                {order.status === 'Pending' && (
                  <p>Your order is queued in the canteen system waiting to be accepted by the staff.</p>
                )}
                {order.status === 'Accepted' && (
                  <p>Canteen staff confirmed your order and is allocating cooking ingredients.</p>
                )}
                {order.status === 'Preparing' && (
                  <p>Your food is actively being cooked fresh on the kitchen stove/grill!</p>
                )}
                {order.status === 'Ready' && (
                  <p className="ready-alert">
                    <CheckCircle size={16} /> <strong>Your food is ready!</strong> Please proceed to the canteen pickup counter with your Order ID.
                  </p>
                )}
                {order.status === 'Completed' && (
                  <p>Order has been fulfilled and handed over. Enjoy your meal!</p>
                )}
              </div>
            </div>

            {/* Detailed Order Summary Grid */}
            <div className="tracking-details-grid">
              <div className="card tracking-items-card">
                <h3 className="section-subheading">Items Ordered</h3>
                <div className="order-items-table">
                  {order.items?.map((item) => (
                    <div key={item.id} className="order-item-line">
                      <div className="item-name-col">
                        <span className="item-title">{item.foodName}</span>
                        <span className="item-unit-calc">
                          ₹{Number(item.unitPrice).toFixed(2)} × {item.quantity}
                        </span>
                      </div>
                      <span className="item-subtotal-val">₹{Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-total-summary-line">
                  <span>Grand Total</span>
                  <span className="total-val">₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              <div className="card tracking-student-card">
                <h3 className="section-subheading">Customer Information</h3>
                <div className="info-pair">
                  <span className="info-label">Student Name:</span>
                  <strong className="info-val">{order.userName}</strong>
                </div>
                <div className="info-pair">
                  <span className="info-label">Student Email:</span>
                  <span className="info-val">{order.userEmail}</span>
                </div>
                <div className="info-pair">
                  <span className="info-label">Canteen Pickup:</span>
                  <span className="info-val">Main Campus Canteen, Counter #1</span>
                </div>
                <div className="info-pair">
                  <span className="info-label">Payment Method:</span>
                  <span className="info-val">College ID / Campus Card (Paid)</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderTracking;
