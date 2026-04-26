import axios from 'axios';

const API_URL = "http://localhost:3000/api/reservas";

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