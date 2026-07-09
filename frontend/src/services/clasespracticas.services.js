import axios from 'axios';

const API_URL = "http://localhost:3000/api/clases-practicas"; 

const getConfig = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

export const getClasesAlumnoRequest = async () => {
    return await axios.get(API_URL, getConfig());
};

export const getClasesInstructorRequest = async () => {
    return await axios.get(`${API_URL}/instructor`, getConfig());
};

export const updateClaseRequest = async (id, data) => {
    return await axios.put(`${API_URL}/calificar/${id}`, data, getConfig());
};

export const getClasesAsignacionesRequest = async () => {
    return await axios.get(`${API_URL}/asignaciones`, getConfig());
};

export const guardarAsignacionRequest = async (id, data) => {
    return await axios.patch(`${API_URL}/asignar/${id}`, data, getConfig());
};

export const cancelarClaseRequest = async (id) => {
    return await axios.delete(`${API_URL}/cancelar/${id}`, getConfig());
};