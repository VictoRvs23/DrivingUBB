import axios from 'axios';

const api=axios.create({
    baseURL:"http://localhost:3000/api",
});

//agregar token a cada request
api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});

//todas las preguntas
export const obtenerPreguntasRequest = async () => {
    return api.get('/preguntas');
};

//generar examen aleatorio
export const generarExamenAleatorioRequest = async (id_estudiante, tiempo_limite_segundos = 3600) => {
    return api.post('/examenteorico', { id_estudiante, tiempo_limite_segundos });
};

export const guardarRespuestasRequest = async (id_examen, respuestas_array) => {
    return api.put(`/examenteorico/${id_examen}/respuestas`, {
        respuestas: respuestas_array
    });
};

//finalizar examen 
export const finalizarExamenRequest = async (id_examen) => {
    return api.put(`/examenteorico/${id_examen}/finalizar`);
};


//obtener examen por id
export const obtenerExamenPorIdRequest = async (id_examen) => {
    return api.get(`/examenteorico/${id_examen}`);
};

//obtener resultado del examen
export const obtenerResultadoRequest = async (id_examen) => {
    return api.get(`/examenteorico/${id_examen}/resultado`);
};