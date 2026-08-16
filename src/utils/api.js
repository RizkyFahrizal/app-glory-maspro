import axios from 'axios';

// Konfigurasi baseURL mengarah ke server Laravel
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Otomatis menyisipkan Token Bearer jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Jangan menimpa Authorization jika sudah di-set manual (seperti multipart/form-data jika perlu)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Tangani error global (misal: Token Expired 401)
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Jika unauthenticated, hapus token dan tendang ke login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
  }
  return Promise.reject(error);
});

export default api;
