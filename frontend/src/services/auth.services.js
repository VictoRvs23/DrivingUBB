import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`
});

export const loginRequest = async (email, password) => {
  try {
    const res = await API.post('/auth/login', { email, password });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error de conexión" };
  }
};