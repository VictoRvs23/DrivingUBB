import { AppDataSource } from "../config/configDb.js";
import { ClasePractica } from "../entities/clasesPracticas.entity.js";

const claseRepository = AppDataSource.getRepository(ClasePractica);

export const getClasesAlumno = async (req, res) => {
    try {
        const clases = await claseRepository.find({
            where: { user: { id: req.user.id } },
            relations: ["instructor", "instructor.user", "vehiculo"],
            order: { numero_clase: "ASC" }
        });
        return res.status(200).json(clases);
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al obtener historial del alumno" });
    }
};

export const getClasesInstructor = async (req, res) => {
    try {
        const clases = await claseRepository.find({
            where: { instructor: { user: { id: req.user.id } } },
            relations: ["user", "vehiculo"],
            order: { fecha_hora: "ASC" }
        });
        return res.status(200).json(clases);
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al obtener agenda del instructor" });
    }
};

export const calificarClase = async (req, res) => {
    try {
        const { id } = req.params;
        const { calificacion } = req.body;

        const clase = await claseRepository.findOneBy({ id: parseInt(id) });
        if (!clase) {
            return res.status(404).json({ mensaje: "Clase no encontrada" });
        }

        clase.calificacion = calificacion;
        // El estado cambia según la nota para reflejar los colores del mockup
        clase.estado = calificacion >= 4.0 ? "Completada" : "Reprobada";

        await claseRepository.save(clase);
        return res.status(200).json({ mensaje: "Calificación registrada", estado: clase.estado });
    } catch (error) {
        return res.status(500).json({ mensaje: "Error al registrar la nota" });
    }
};