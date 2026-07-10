import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

const API = axios.create({
    baseURL: `${API_BASE_URL}/api`
});

// Adjunta el token en cada request, igual que el resto de services del proyecto
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Crea un nuevo ticket de soporte (con imagen opcional).
 * Envía multipart/form-data para soportar el uploadImage middleware del backend.
 * @param {FormData} formData - campos: tipo, titulo, descripcion, imagen_adjunta (opcional)
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
 * Obtiene los tickets del usuario autenticado.
 * @param {string|null} tipo - Filtro opcional: 'Duda' | 'Error' | 'Reclamo' | 'Sugerencia' | null
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
 * Obtiene todos los tickets (solo admin/secretaria).
 * @param {string|null} tipo - Filtro opcional: 'Duda' | 'Error' | 'Reclamo' | 'Sugerencia' | null
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
 * Envía una respuesta de admin a un ticket. PATCH /soporte/:id/responder
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
 * Soft-delete de un ticket (cambia estado a "eliminado"). DELETE /soporte/:id
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
