import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/api';
import { 
  Clock, 
  ShoppingBag, 
  ChevronRight, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders(user.id);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load student orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge badge-success">{status}</span>;
      case 'Ready':
        return <span className="badge badge-primary">{status} (Pick up!)</span>;
      case 'Preparing':
        return <span className="badge badge-accent">{status}</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-history-page">
      <div className="container">
        <div className="history-header-bar">
          <div>
            <h1 className="history-title">My Canteen Orders</h1>
            <p className="history-subtitle">
              Review past purchases, current active meals, and real-time cooking progress.
            </p>
          </div>

          <button onClick={loadOrders} className="btn btn-outline btn-sm">
            <RefreshCw size={14} /> Refresh Orders
          </button>
        </div>

        {loading ? (
          <div className="center-box">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Retrieving your order records...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Clock size={32} />
            </div>
            <h3>No Orders Placed Yet</h3>
            <p>You haven't ordered anything from the campus canteen yet. Try our tasty meals today!</p>
            <Link to="/menu" className="btn btn-primary">
              Order Food Now
            </Link>
          </div>
        ) : (
          <div className="orders-list-wrapper">
            {orders.map((ord) => (
              <div key={ord.id} className="card history-order-card">
                <div className="order-card-header">
                  <div className="order-id-group">
                    <span className="order-id-label">Order Number</span>
                    <strong className="order-id-val">{ord.orderNumber}</strong>
                  </div>

                  <div className="order-meta-group">
                    <span className="order-date-time">
                      <Calendar size={14} /> {formatDate(ord.createdAt)}
                    </span>
                    {getStatusBadge(ord.status)}
                  </div>
                </div>

                <div className="order-items-preview">
                  <div className="items-tags-list">
                    {ord.items?.map((item) => (
                      <span key={item.id} className="item-preview-pill">
                        {item.foodName} <strong className="item-pill-qty">×{item.quantity}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="order-card-footer">
                  <div className="order-cost-box">
                    <span className="total-cost-label">Total Amount</span>
                    <span className="total-cost-val">₹{Number(ord.totalAmount).toFixed(2)}</span>
                  </div>

                  <Link to={`/track/${ord.orderNumber}`} className="btn btn-primary btn-sm view-track-btn">
                    Track Status & Receipt <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
