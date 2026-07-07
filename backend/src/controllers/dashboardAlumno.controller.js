import { AppDataSource } from "../config/configDb.js";
import { ClasePractica } from "../entities/clasesPracticas.entity.js";
import { Reserva } from "../entities/reservas.entity.js";

export const getDashboardAlumno = async (req, res) => {
    try {
        const userId = req.user.id; 
        
        const claseRepository = AppDataSource.getRepository(ClasePractica);
        const reservaRepository = AppDataSource.getRepository(Reserva);
        const clasesTomadas = await claseRepository.find({
            where: { user: { id: userId }, estado: "Completada" }
        });
        
        const horasPracticas = clasesTomadas.length; 
        const fechaActual = new Date();
        const proximaClase = await claseRepository.findOne({
            where: { 
                user: { id: userId },
                estado: "Pendiente" 
            },
            order: { fecha_hora: "ASC" },
            relations: ["instructor"]
        });

        const horasTeoricas = 0;
        const examenesAprobados = 0;
        const dashboardData = {
            horasPracticas,
            horasTeoricas,
            examenesAprobados,
            proximaActividad: proximaClase ? {
                tipo: `Clase n°${proximaClase.numero_clase}: ${proximaClase.tema}`,
                fecha: proximaClase.fecha_hora,
                instructor: proximaClase.instructor ? proximaClase.instructor.nombre : "Por asignar"
            } : null
        };

        res.status(200).json(dashboardData);

    } catch (error) {
        console.error("Error al cargar el dashboard:", error);
        res.status(500).json({ message: "Error interno al cargar el inicio." });
    }
};