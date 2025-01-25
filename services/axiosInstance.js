// services/axiosInstance.js
import axios from 'axios';
// import { DEVELOPMENT_URL, PRODUCTION_URL } from '@env';

const DEVELOPMENT_URL = 'http://192.168.1.46:3000';
const PRODUCTION_URL = 'https://www.chefhavn.com';

// Define your base URL based on environment
const isDevelopment = __DEV__;
// const isDevelopment = '';
const BASE_URL = isDevelopment ? DEVELOPMENT_URL : PRODUCTION_URL;
// const BASE_URL = 'https://www.chefhavn.com';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // You can add additional headers or modify the request config here
    // For example, add authentication token
    // const token = getToken(); // Replace with your token fetching logic
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.error('API call error:', error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
