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

