import axios from "axios";

const API_URL = "http://localhost:3000/api/evaluacionpractica";

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
}

export const registrarFaltaRequest = async (id, faltaData) => {
    const token = localStorage.getItem('token');
    return await axios.post(`${API_URL}/${id}/falta`, faltaData, {
        headers: { Authorization: `Bearer ${token}`, },
    });
}

