import { AppDataSource } from "../config/configDb.js";
import { ClasePractica } from "../entities/clasesPracticas.entity.js";

const claseRepository = AppDataSource.getRepository(ClasePractica);

export const getClasesAlumnoService = async (userId) => {
    return await claseRepository.find({
        where: { user: { id: userId } },
        relations: ["instructor", "vehiculo"],
        order: { numero_clase: "ASC" }
    });
};

export const getClasesInstructorService = async (instructorId) => {
    return await claseRepository.find({
        where: { instructor: { id: instructorId } },
        relations: ["user", "vehiculo"],
        order: { fecha_hora: "ASC" }
    });
};

export const calificarClaseService = async (id, calificacion) => {
    const clase = await claseRepository.findOneBy({ id: parseInt(id) });
    if (!clase) {
        throw { status: 404, message: "Clase no encontrada" };
    }

    clase.calificacion = calificacion;
    clase.estado = calificacion >= 4.0 ? "Completada" : "Reprobada";
    return await claseRepository.save(clase);
};