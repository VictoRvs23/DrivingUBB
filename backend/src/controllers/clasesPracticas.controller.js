import { AppDataSource } from "../config/configDb.js";
import { ClasePractica } from "../entities/clasesPracticas.entity.js";
import { User } from "../entities/user.entity.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";
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
        if (error.status) return res.status(error.status).json({ mensaje: error.mensaje });
        console.error("Error en calificarClase:", error);
        res.status(500).json({ mensaje: "Error interno al calificar la clase" });
    }
};

export const getClasesParaAsignacion = async (req, res) => {
    try {
        const claseRepository = AppDataSource.getRepository(ClasePractica);
        const clases = await claseRepository.find({
            relations: ["user", "instructor", "vehiculo"],
            order: { fecha_hora: "ASC" }
        });
        return res.status(200).json(clases);
    } catch (error) {
        console.error("Error al obtener clases para asignación:", error);
        return res.status(500).json({ mensaje: "Error interno al obtener las clases" });
    }
};

export const asignarInstructorYVehiculo = async (req, res) => {
    try {
        const { id } = req.params; 
        const { instructorId, vehiculoId } = req.body;

        const claseRepository = AppDataSource.getRepository(ClasePractica);
        const userRepository = AppDataSource.getRepository(User);
        const vehiculoRepository = AppDataSource.getRepository(Vehiculo);

        const clase = await claseRepository.findOne({ where: { id: parseInt(id) } });
        if (!clase) {
            return res.status(404).json({ mensaje: "Clase práctica no encontrada" });
        }

        if (instructorId) {
            const instructor = await userRepository.findOne({ where: { id: parseInt(instructorId), role: "instructor" } });
            if (!instructor) {
                return res.status(404).json({ mensaje: "El instructor seleccionado no es válido o no existe" });
            }
            clase.instructor = instructor;
        }

        if (vehiculoId) {
            const vehiculo = await vehiculoRepository.findOne({ where: { id: parseInt(vehiculoId) } });
            if (!vehiculo) {
                return res.status(404).json({ mensaje: "El vehículo seleccionado no existe" });
            }
            
            const hoy = new Date();
            const vencimientoPermiso = new Date(vehiculo.vencimiento_permiso);
            const vencimientoRevision = new Date(vehiculo.vencimiento_revision);

            if (vencimientoPermiso < hoy || vencimientoRevision < hoy) {
                vehiculo.estado = "No Disponible";
                await vehiculoRepository.save(vehiculo);
                
                return res.status(400).json({ 
                    mensaje: "Operación rechazada: Los documentos del vehículo están vencidos. El vehículo ha sido inhabilitado." 
                });
            }

            clase.vehiculo = vehiculo;
        }

        if (instructorId && vehiculoId) {
            clase.estado = "Confirmada";
        }

        await claseRepository.save(clase);

        return res.status(200).json({ 
            mensaje: "Asignación guardada con éxito", 
            clase 
        });
    } catch (error) {
        console.error("Error en la asignación de recursos:", error);
        return res.status(500).json({ mensaje: "Error interno al procesar la asignación" });
    }
};

export const cancelarClase = async (req, res) => {
    try {
        const { id } = req.params;
        const claseRepository = AppDataSource.getRepository(ClasePractica);
        const clase = await claseRepository.findOne({ where: { id: parseInt(id) } });
        
        if (!clase) {
            return res.status(404).json({ mensaje: "Clase práctica no encontrada" });
        }

        await claseRepository.remove(clase);

        return res.status(200).json({ mensaje: "Clase cancelada exitosamente" });
    } catch (error) {
        console.error("Error al cancelar la clase:", error);
        return res.status(500).json({ mensaje: "Error interno al cancelar la clase" });
    }
};