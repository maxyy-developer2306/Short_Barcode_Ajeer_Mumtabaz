import axios from 'axios';

const API = axios.create({
  // baseURL ke aakhir me /api lazmi hona chahiye
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Har request ke sath JWT token attach karne ke liye
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;