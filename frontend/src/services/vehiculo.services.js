import axios from 'axios';
import { API_BASE_URL } from "../config/api.js";
const API_URL = `${API_BASE_URL}/api/vehiculos`;

const getConfig = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

const getMultipartConfig = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
        }
    };
};

export const getVehiculosRequest = async () => {
    return await axios.get(API_URL, getConfig());
};

export const createVehiculoRequest = async (vehiculoData) => {
    return await axios.post(API_URL, vehiculoData, getMultipartConfig());
};

export const updateVehiculoRequest = async (id, vehiculoData) => {
    return await axios.put(`${API_URL}/${id}`, vehiculoData, getMultipartConfig());
};

export const deleteVehiculoRequest = async (id) => {
    return await axios.delete(`${API_URL}/${id}`, getConfig());
};