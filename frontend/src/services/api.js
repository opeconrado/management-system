import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const categoryService = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

export const productService = {
    getAll: (page = 1, limit = 10, filters = {}) =>
        api.get('/products', { params: { page, limit, ...filters } }),
    getById: (id) => api.get(`/products/${id}`),
    getStats: () => api.get('/products/stats/overview'),
    getLowStock: () => api.get('/products/low-stock'),
    getZeroStock: () => api.get('/products/zero-stock'),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

export const movementService = {
    getAll: (page = 1, limit = 10, filters = {}) =>
        api.get('/movements', { params: { page, limit, ...filters } }),
    getById: (id) => api.get(`/movements/${id}`),
    create: (data) => api.post('/movements', data),
    getABCCurve: () => api.get('/movements/abc-curve'),
    getByDateRange: (dataInicio, dataFim) =>
        api.get('/movements/by-date-range', { params: { data_inicio: dataInicio, data_fim: dataFim } }),
    getProductHistory: (produtoId, days = 30) =>
        api.get(`/movements/product/${produtoId}/history`, { params: { days } }),
    registerBarcode: (sku) => api.post('/movements/barcode/register', { sku }),
};

export default api;
