import axios from "axios";
import { API_BASE_URL } from "../config/api.js";

const API_URL = `${API_BASE_URL}/api/evaluacionpractica`;

export const crearEvaluacionRequest = async (evaluacionData) => {
    const token = localStorage.getItem('token');
    return await axios.post(API_URL, evaluacionData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const obtenerEvaluacionesRequest = async () => {
    const token = localStorage.getItem('token');
    return await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}`, },
    });
};

export const obtenerEvaluacionPorIdRequest = async (id) => {
    const token = localStorage.getItem('token');
    return await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}`, },
    });
};

export const obtenerEvaluacionesPorEstudianteRequest = async (id_estudiante) => {
    const token = localStorage.getItem('token');
    return await axios.get(`${API_URL}/estudiante/${id_estudiante}`, {
        headers: { Authorization: `Bearer ${token}`, },
    });
};

export const registrarFaltaRequest = async (id, faltaData) => {
    const token = localStorage.getItem('token');
    return await axios.post(`${API_URL}/${id}/falta`, faltaData, {
        headers: { Authorization: `Bearer ${token}`, },
    });
};

export const finalizarEvaluacionRequest = async (id, evaluacionData) => {
    const token = localStorage.getItem('token');
    return await axios.put(`${API_URL}/${id}/finalizar`, evaluacionData, {
        headers: { Authorization: `Bearer ${token}`, },
    });
};

export const actualizarEvaluacionRequest = async (id, evaluacionData) => {
    const token = localStorage.getItem('token');
    return await axios.put(`${API_URL}/${id}`, evaluacionData, {
        headers: { Authorization: `Bearer ${token}`, },
    });
};

export const eliminarEvaluacionRequest = async (id) => {
    const token = localStorage.getItem('token');
    return await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}`, },
    });
};
