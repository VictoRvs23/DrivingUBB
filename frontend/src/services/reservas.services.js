import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const API_URL = `${API_BASE_URL}/api/reservas`;

export const createReservaRequest = async (reservaData) => {
    const token = localStorage.getItem('token');
    return await axios.post(API_URL, reservaData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getReservasRequest = async (fecha) => {
    const token = localStorage.getItem('token');
    return await axios.get(`${API_URL}?fecha=${fecha}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};