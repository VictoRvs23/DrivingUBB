import axios from 'axios';

const API = axios.create({
    baseURL: `http://localhost:3000/api`
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * 
 * @param {FormData} formData 
 */
export const createSoporteRequest = async (formData) => {
    try {
        const res = await API.post('/soporte', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Error de conexión al crear soporte' };
    }
};

/**
 * 
 * @param {string|null} tipo 
 */

export const getMisSoportesRequest = async (tipo = null) => {
    try {
        const params = tipo ? { tipo } : {};
        const res = await API.get('/soporte/mis-soportes', { params });
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Error al obtener tus soportes' };
    }
};

/**
 * 
 * @param {string|null} tipo 
 */
export const getAllSoportesRequest = async (tipo = null) => {
    try {
        const params = tipo ? { tipo } : {};
        const res = await API.get('/soporte/admin/todos', { params });
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Error al obtener todos los soportes' };
    }
};

/**
 * 
 * @param {number|string} id
 * @param {string} respuesta_admin
 */
export const responderSoporteRequest = async (id, respuesta_admin) => {
    try {
        const res = await API.patch(`/soporte/admin/responder/${id}`, { respuesta_admin });
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Error al responder el soporte' };
    }
};

/**
 * 
 * @param {number|string} id
 */
export const deleteSoporteRequest = async (id) => {
    try {
        const res = await API.delete(`/soporte/${id}`);
        return res.data;
    } catch (err) {
        throw err.response?.data || { message: 'Error al eliminar el soporte' };
    }
};
