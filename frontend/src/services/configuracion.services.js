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

/**
 *
 * @param {{ oldPassword: string, newPassword: string, confirmPassword: string }} data
 */
export const changePasswordRequest = async (data) => {
    try {
        const res = await API.put('/configuracion/cambiar-password', data);
        return res.data;
    } catch (err) {
        console.error('[config] changePassword error:', err.response?.status, err.response?.data);
        throw err.response?.data || { message: 'Error al cambiar la contraseña' };
    }
};

/**
 * 
 * @param {boolean} recibir_correos
 */
export const toggleEmailsRequest = async (recibir_correos) => {
    try {
        const res = await API.put('/configuracion/correos', { recibir_correos });
        return res.data;
    } catch (err) {
        console.error('[config] toggleEmails error:', err.response?.status, err.response?.data);
        throw err.response?.data || { message: 'Error al actualizar preferencia de correos' };
    }
};
