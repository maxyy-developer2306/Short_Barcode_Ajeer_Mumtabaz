import axios from 'axios';

const API = axios.create({
  // baseURL ke aakhir me /api lazmi hona chahiye
  baseURL: 'https://short-barcode-ajeer-mumtabaz.vercel.app/api',
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