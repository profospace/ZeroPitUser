// src/utils/api.js
import axios from 'axios';
import { base_url } from './base_url'; // you already have this
const API_URL = `${base_url}/api`;

const api = axios.create({
    baseURL: API_URL,
    timeout: 20000,
});

// attach token (if present) to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
