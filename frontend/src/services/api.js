import axios from 'axios';

// Normalize the base URL to ensure it always correctly routes to the Spring Boot REST API
// Handles:
// - https://my-backend.onrender.com (appends /api)
// - https://my-backend.onrender.com/ (appends /api)
// - https://my-backend.onrender.com/api (kept as is)
// - https://my-backend.onrender.com/api/ (removes trailing slash)
// - undefined / empty (defaults to http://localhost:8080/api for local dev)
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl || !envUrl.trim()) {
    return 'http://localhost:8080/api';
  }
  let cleanUrl = envUrl.trim().replace(/\/+$/, '');
  if (!cleanUrl.endsWith('/api')) {
    cleanUrl = `${cleanUrl}/api`;
  }
  return cleanUrl;
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
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
