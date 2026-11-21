import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Food APIs
export const getFoods = async (params = {}) => {
  const response = await api.get('/foods', { params });
  return response.data;
};

export const getFoodById = async (id) => {
  const response = await api.get(`/foods/${id}`);
  return response.data;
};

// Order APIs
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getMyOrders = async (userId) => {
  const response = await api.get('/orders/my', { params: { userId } });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getOrderByNumber = async (orderNumber) => {
  const response = await api.get(`/orders/number/${orderNumber}`);
  return response.data;
};

// Admin APIs
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAdminOrders = async (status = '') => {
  const params = status && status !== 'ALL' ? { status } : {};
  const response = await api.get('/admin/orders', { params });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
  return response.data;
};

export const addFood = async (foodData) => {
  const response = await api.post('/admin/foods', foodData);
  return response.data;
};

export const updateFood = async (id, foodData) => {
  const response = await api.put(`/admin/foods/${id}`, foodData);
  return response.data;
};

export const deleteFood = async (id) => {
  const response = await api.delete(`/admin/foods/${id}`);
  return response.data;
};

// Auth APIs
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export default api;
