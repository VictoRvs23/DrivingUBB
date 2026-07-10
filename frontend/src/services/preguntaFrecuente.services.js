import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api'
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getFAQsRequest = async () => {
    try {
        const res = await API.get('/faqs');
        return res.data;
    } catch (err) {
        console.error('[faq] getFAQs error:', err.response?.status, err.response?.data);
        throw err.response?.data || { message: 'Error al obtener las preguntas frecuentes' };
    }
};

/**
 * 
 * @param {{ pregunta: string, respuesta: string }} data
 */
export const createFAQRequest = async (data) => {
    try {
        const res = await API.post('/faqs', data);
        return res.data;
    } catch (err) {
        console.error('[faq] createFAQ error:', err.response?.status, err.response?.data);
        throw err.response?.data || { message: 'Error al crear la pregunta frecuente' };
    }
};

/**
 * 
 * @param {number|string} id
 * @param {{ pregunta?: string, respuesta?: string }} data
 */
export const updateFAQRequest = async (id, data) => {
    try {
        const res = await API.patch(`/faqs/${id}`, data);
        return res.data;
    } catch (err) {
        console.error('[faq] updateFAQ error:', err.response?.status, err.response?.data);
        throw err.response?.data || { message: 'Error al actualizar la pregunta frecuente' };
    }
};

/**
 * 
 * @param {number|string} id
 */
export const deleteFAQRequest = async (id) => {
    try {
        const res = await API.delete(`/faqs/${id}`);
        return res.data;
    } catch (err) {
        console.error('[faq] deleteFAQ error:', err.response?.status, err.response?.data);
        throw err.response?.data || { message: 'Error al eliminar la pregunta frecuente' };
    }
};
