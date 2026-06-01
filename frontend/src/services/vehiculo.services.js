import axios from 'axios';

const API_URL = "http://localhost:3000/api/vehiculos";

const getConfig = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const getVehiculosRequest = async () => {
    return await axios.get(API_URL, getConfig());
};

export const createVehiculoRequest = async (vehiculoData) => {
    return await axios.post(API_URL, vehiculoData, getConfig());
};

export const updateVehiculoRequest = async (id, vehiculoData) => {
    return await axios.put(`${API_URL}/${id}`, vehiculoData, getConfig());
};

export const deleteVehiculoRequest = async (id) => {
    return await axios.delete(`${API_URL}/${id}`, getConfig());
};