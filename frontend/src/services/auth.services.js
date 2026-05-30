import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api'
});

export const loginRequest = async (email, password) => {
  try {
    const res = await API.post('/auth/login', { email, password });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error de conexión" };
  }
};