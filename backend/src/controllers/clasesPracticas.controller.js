import * as clasesService from "../services/clasesPracticas.services.js";

export const getClasesAlumno = async (req, res) => {
    try {
        const clases = await clasesService.getClasesAlumnoService(req.user.id);
        res.status(200).json(clases);
    } catch (error) {
        console.error("Error real en getClasesAlumno:", error); 
        res.status(500).json({ mensaje: "Error al obtener historial del alumno" });
    }
};

export const getClasesInstructor = async (req, res) => {
    try {
        const clases = await clasesService.getClasesInstructorService(req.user.id);
        res.status(200).json(clases);
    } catch (error) {
        console.error("Error real en getClasesInstructor:", error);
        res.status(500).json({ mensaje: "Error al obtener agenda del instructor" });
    }
};

export const calificarClase = async (req, res) => {
    try {
        const { calificacion } = req.body;
        const claseCalificada = await clasesService.calificarClaseService(req.params.id, calificacion);
        res.status(200).json({ mensaje: "Calificación registrada", estado: claseCalificada.estado });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ mensaje: error.message });
        console.error("Error real en calificarClase:", error);
        res.status(500).json({ mensaje: "Error al registrar la nota" });
    }
};