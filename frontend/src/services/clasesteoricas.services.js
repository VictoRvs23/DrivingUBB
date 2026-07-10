import axios from 'axios';

const API_URL = `http://localhost:3000/api/clases-teoricas`;

const getConfig = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const getClasesTeoricasRequest = async () => {
    return await axios.get(API_URL, getConfig());
};

export const getMisClasesTeoricasRequest = async () => {
    return await axios.get(`${API_URL}/mis-clases`, getConfig());
};

export const crearClaseTeoricaRequest = async (data) => {
    return await axios.post(API_URL, data, getConfig());
};

export const editarClaseTeoricaRequest = async (id, data) => {
    return await axios.put(`${API_URL}/${id}`, data, getConfig());
};

export const eliminarClaseTeoricaRequest = async (id) => {
    return await axios.delete(`${API_URL}/${id}`, getConfig());
};