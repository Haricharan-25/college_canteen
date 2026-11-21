import React, { useState, useEffect } from 'react';
import { 
  getAdminStats, 
  getAdminOrders, 
  updateOrderStatus, 
  getFoods, 
  addFood, 
  updateFood, 
  deleteFood 
} from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Utensils, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Filter, 
  Layers, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  X,
  Check
} from 'lucide-react';
import './AdminDashboard.css';

const CATEGORIES = ['Breakfast', 'Lunch', 'Snacks', 'Beverages'];
const STATUSES = ['ALL', 'Pending', 'Accepted', 'Preparing', 'Ready', 'Completed'];
const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, foods
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Food Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Breakfast',
    imageUrl: '',
    available: true,
  });

  useEffect(() => {
    loadAllAdminData();
  }, [selectedStatus]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData, foodsData] = await Promise.all([
        getAdminStats(),
        getAdminOrders(selectedStatus),
        getFoods(),
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setFoods(foodsData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast('Could not fetch admin data from backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to "${newStatus}"`, 'success');
      loadAllAdminData();
    } catch (err) {
      showToast('Failed to update status: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  // Food Management Handlers
  const handleOpenAddModal = () => {
    setEditingFood(null);
    setFoodForm({
      name: '',
      description: '',
      price: '',
      category: 'Breakfast',
      imageUrl: '',
      available: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (food) => {
    setEditingFood(food);
    setFoodForm({
      name: food.name,
      description: food.description || '',
      price: food.price,
      category: food.category,
      imageUrl: food.imageUrl || '',
      available: food.available,
    });
    setIsModalOpen(true);
  };

  const handleSaveFood = async (e) => {
    e.preventDefault();
    if (!foodForm.name || !foodForm.price) {
      showToast('Please provide both food name and price', 'error');
      return;
    }

    try {
      if (editingFood) {
        await updateFood(editingFood.id, {
          ...foodForm,
          price: parseFloat(foodForm.price),
        });
        showToast(`Updated "${foodForm.name}" successfully!`, 'success');
      } else {
        await addFood({
          ...foodForm,
          price: parseFloat(foodForm.price),
        });
        showToast(`Added new dish "${foodForm.name}"!`, 'success');
      }
      setIsModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      showToast('Failed to save food: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleDeleteFood = async (food) => {
    if (window.confirm(`Are you sure you want to permanently delete "${food.name}"?`)) {
      try {
        await deleteFood(food.id);
        showToast(`Food "${food.name}" deleted successfully.`, 'info');
        loadAllAdminData();
      } catch (err) {
        showToast('Could not delete food. It may be linked to existing orders.', 'error');
      }
    }
  };

  const handleToggleAvailability = async (food) => {
    try {
      await updateFood(food.id, {
        ...food,
        available: !food.available,
      });
      showToast(`Set "${food.name}" to ${!food.available ? 'Available' : 'Sold Out'}`, 'info');
      loadAllAdminData();
    } catch (err) {
      showToast('Failed to toggle availability.', 'error');
    }
  };

  const getOrderStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Ready': return 'badge-success';
      case 'Preparing': return 'badge-accent';
      case 'Accepted': return 'badge-primary';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="admin-page-layout">
      {/* Admin Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-badge-role">Canteen Administration</span>
          <h2 className="admin-panel-title">Operations Desk</h2>
        </div>

        <nav className="admin-nav-menu">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <TrendingUp size={18} /> Overview & Analytics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          >
            <ShoppingBag size={18} /> Live Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('foods')}
            className={`admin-nav-item ${activeTab === 'foods' ? 'active' : ''}`}
          >
            <Utensils size={18} /> Menu Catalog ({foods.length})
          </button>
        </nav>

        <div className="sidebar-footer-info">
          <span className="canteen-status-dot" />
          <span>Canteen Open & Online</span>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="admin-main-viewport">
        <div className="admin-top-action-bar">
          <div>
            <h1 className="admin-workspace-title">
              {activeTab === 'overview' && 'Canteen Operations Dashboard'}
              {activeTab === 'orders' && 'Student Food Orders Management'}
              {activeTab === 'foods' && 'Menu Catalog & Pricing Management'}
            </h1>
            <p className="admin-workspace-sub">
              Live MySQL database synchronization. Track orders and manage menu items.
            </p>
          </div>

          <div className="admin-header-actions">
            <button 
              type="button" 
              onClick={loadAllAdminData} 
              className="btn btn-outline btn-sm"
              title="Refresh all data"
            >
              <RefreshCw size={14} /> Refresh Data
            </button>
            {activeTab === 'foods' && (
              <button 
                type="button" 
                onClick={handleOpenAddModal} 
                className="btn btn-primary btn-sm"
              >
                <Plus size={16} /> Add Food Item
              </button>
            )}
          </div>
        </div>

        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="tab-pane">
            {/* KPI Stat Cards Grid */}
            <div className="stats-kpi-grid">
              <div className="card kpi-card">
                <div className="kpi-icon-box kpi-blue">
                  <Utensils size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Total Menu Items</span>
                  <strong className="kpi-number">{stats?.totalFoods ?? foods.length}</strong>
                </div>
              </div>

              <div className="card kpi-card">
                <div className="kpi-icon-box kpi-slate">
                  <ShoppingBag size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Total Orders Placed</span>
                  <strong className="kpi-number">{stats?.totalOrders ?? orders.length}</strong>
                </div>
              </div>

              <div className="card kpi-card">
                <div className="kpi-icon-box kpi-amber">
                  <Clock size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">In-Queue / Cooking</span>
                  <strong className="kpi-number">{stats?.pendingOrders ?? 0}</strong>
                </div>
              </div>

              <div className="card kpi-card">
                <div className="kpi-icon-box kpi-green">
                  <CheckCircle2 size={22} />
                </div>
                <div className="kpi-info">
                  <span className="kpi-label">Completed Pickups</span>
                  <strong className="kpi-number">{stats?.completedOrders ?? 0}</strong>
                </div>
              </div>
            </div>

            {/* Quick Shortcuts & Recent Orders Section */}
            <div className="overview-sections-grid">
              <div className="card overview-card">
                <div className="card-header-clean">
                  <h3 className="card-heading-title">Recent Incoming Orders</h3>
                  <button type="button" onClick={() => setActiveTab('orders')} className="link-text-btn">
                    View All Orders <ChevronRight size={14} />
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Student</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                            No orders received yet today.
                          </td>
                        </tr>
                      ) : (
                        orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id}>
                            <td><strong className="order-mono-id">{ord.orderNumber}</strong></td>
                            <td>{ord.userName}</td>
                            <td>{ord.items?.length || 0} items</td>
                            <td><strong>₹{Number(ord.totalAmount).toFixed(2)}</strong></td>
                            <td>
                              <span className={`badge ${getOrderStatusBadgeClass(ord.status)}`}>
                                {ord.status}
                              </span>
                            </td>
                            <td>
                              <select
                                value={ord.status}
                                onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                                className="status-quick-select"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Ready">Ready</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="card overview-card shortcuts-card">
                <h3 className="card-heading-title">Quick Operations</h3>
                <p className="shortcuts-desc">Fast administrative actions during peak canteen lunch breaks.</p>

                <div className="shortcuts-buttons-list">
                  <button type="button" onClick={handleOpenAddModal} className="btn btn-primary shortcut-btn">
                    <Plus size={16} /> Add New Dish or Beverage
                  </button>
                  <button type="button" onClick={() => setActiveTab('foods')} className="btn btn-outline shortcut-btn">
                    <Utensils size={16} /> Manage Dish Availability & Prices
                  </button>
                  <button type="button" onClick={() => { setActiveTab('orders'); setSelectedStatus('Pending'); }} className="btn btn-outline shortcut-btn">
                    <Clock size={16} /> View Pending Orders Queue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ORDER MANAGEMENT ===================== */}
        {activeTab === 'orders' && (
          <div className="tab-pane">
            <div className="orders-filter-bar card">
              <span className="filter-title">Filter by Status:</span>
              <div className="status-filter-pills">
                {STATUSES.map((st) => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`status-filter-btn ${selectedStatus === st ? 'active' : ''}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="card orders-table-card">
              <div className="table-responsive">
                <table className="admin-table full-width">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Time</th>
                      <th>Student Details</th>
                      <th>Ordered Dishes</th>
                      <th>Total</th>
                      <th>Kitchen Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                          No orders found under "{selectedStatus}" status.
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id}>
                          <td>
                            <strong className="order-mono-id">{ord.orderNumber}</strong>
                          </td>
                          <td className="text-muted text-sm">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td>
                            <strong>{ord.userName}</strong>
                            <div className="text-muted text-xs">{ord.userEmail}</div>
                          </td>
                          <td>
                            <div className="order-dish-chips">
                              {ord.items?.map((it) => (
                                <span key={it.id} className="dish-chip">
                                  {it.foodName} (×{it.quantity})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <strong className="order-amount-text">₹{Number(ord.totalAmount).toFixed(2)}</strong>
                          </td>
                          <td>
                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                              className={`admin-status-dropdown ${ord.status.toLowerCase()}`}
                            >
                              <option value="Pending">1. Pending</option>
                              <option value="Accepted">2. Accepted</option>
                              <option value="Preparing">3. Preparing</option>
                              <option value="Ready">4. Ready for Pickup</option>
                              <option value="Completed">5. Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: FOOD MANAGEMENT ===================== */}
        {activeTab === 'foods' && (
          <div className="tab-pane">
            <div className="card foods-table-card">
              <div className="table-responsive">
                <table className="admin-table full-width">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Dish Name & Description</th>
                      <th>Category</th>
                      <th>Price (₹)</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map((food) => (
                      <tr key={food.id}>
                        <td>
                          <img
                            src={food.imageUrl || DEFAULT_FOOD_IMAGE}
                            alt={food.name}
                            className="admin-food-thumb"
                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FOOD_IMAGE; }}
                          />
                        </td>
                        <td style={{ maxWidth: '280px' }}>
                          <strong className="food-table-title">{food.name}</strong>
                          <p className="food-table-desc">{food.description}</p>
                        </td>
                        <td>
                          <span className="badge badge-neutral">{food.category}</span>
                        </td>
                        <td>
                          <strong className="food-table-price">₹{Number(food.price).toFixed(2)}</strong>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(food)}
                            className={`badge ${food.available ? 'badge-success' : 'badge-danger'} clickable-badge`}
                            title="Click to toggle availability"
                          >
                            {food.available ? 'Available' : 'Sold Out'}
                          </button>
                        </td>
                        <td>
                          <div className="admin-row-actions">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(food)}
                              className="btn btn-outline btn-sm action-icon-btn"
                              title="Edit Food Details"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFood(food)}
                              className="btn btn-outline btn-sm action-icon-btn delete-btn"
                              title="Delete Food Item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add / Edit Food Item */}
        {isModalOpen && (
          <div className="modal-backdrop">
            <div className="card modal-dialog-box">
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingFood ? `Edit "${editingFood.name}"` : 'Add New Food Item'}
                </h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="modal-close-btn" aria-label="Close dialog">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveFood} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={foodForm.name}
                    onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                    placeholder="e.g. Masala Dosa, Cold Coffee"
                    className="form-control"
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      value={foodForm.category}
                      onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                      className="form-control"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price in ₹ (INR) *</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      required
                      value={foodForm.price}
                      onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                      placeholder="e.g. 60.00"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="3"
                    value={foodForm.description}
                    onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                    placeholder="Ingredients, spice level, accompaniments..."
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Food Image URL</label>
                  <input
                    type="url"
                    value={foodForm.imageUrl}
                    onChange={(e) => setFoodForm({ ...foodForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="form-control"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={foodForm.available}
                      onChange={(e) => setFoodForm({ ...foodForm, available: e.target.checked })}
                    />
                    <span>Dish is currently available to order</span>
                  </label>
                </div>

                <div className="modal-footer-actions">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingFood ? 'Save Changes' : 'Create Food Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
