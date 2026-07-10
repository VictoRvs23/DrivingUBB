import { AppDataSource } from "../config/configDb.js";
import { ClasePractica } from "../entities/clasesPracticas.entity.js";
import { Reserva } from "../entities/reservas.entity.js";
import { ClaseTeorica } from "../entities/clasesTeoricas.entity.js";
import { ExamenTeorico } from "../entities/examenteorico.entity.js";

export const getDashboardAlumno = async (req, res) => {
    try {
        const userId = req.user.id;

        const claseRepository = AppDataSource.getRepository(ClasePractica);
        const reservaRepository = AppDataSource.getRepository(Reserva);
        const claseTeoricaRepository = AppDataSource.getRepository(ClaseTeorica);
        const examenRepository = AppDataSource.getRepository(ExamenTeorico);
        const clasesTomadas = await claseRepository.find({
            where: { user: { id: userId }, estado: "Completada" }
        });

        const horasPracticas = clasesTomadas.length;

        const fechaActual = new Date();

        const proximaClasePractica = await claseRepository.findOne({
            where: {
                user: { id: userId },
                estado: "Pendiente"
            },
            order: { fecha_hora: "ASC" },
            relations: ["instructor"]
        });

        const clasesTeoricas = await claseTeoricaRepository.find({
            relations: ["profesor"]
        });

        const HORAS_POR_CLASE_TEORICA = 2;

        const clasesTeoricasCompletadas = clasesTeoricas.filter(
            (clase) => new Date(clase.fecha_hora) < fechaActual
        ).length;

        const horasTeoricas = clasesTeoricasCompletadas * HORAS_POR_CLASE_TEORICA;

        const proximaClaseTeorica = clasesTeoricas
            .filter((clase) => new Date(clase.fecha_hora) >= fechaActual)
            .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))[0] || null;

        const examenesFinalizados = await examenRepository.find({
            where: { id_estudiante: userId, estado: "finalizado" }
        });

        const examenesAprobados = examenesFinalizados.filter(
            (examen) => examen.puntaje_obtenido >= 60
        ).length;

        const candidatos = [];

        if (proximaClasePractica) {
            candidatos.push({
                tipo: `Clase n°${proximaClasePractica.numero_clase}: ${proximaClasePractica.tema}`,
                fecha: proximaClasePractica.fecha_hora,
                instructor: proximaClasePractica.instructor ? proximaClasePractica.instructor.nombre : "Por asignar",
                isTeorica: false
            });
        }

        if (proximaClaseTeorica) {
            candidatos.push({
                tipo: `Clase Teórica: ${proximaClaseTeorica.titulo_clase}`,
                fecha: proximaClaseTeorica.fecha_hora,
                instructor: proximaClaseTeorica.profesor ? proximaClaseTeorica.profesor.nombre : "Por asignar",
                enlace_videollamada: proximaClaseTeorica.enlace_videollamada,
                isTeorica: true
            });
        }

        const proximaActividad = candidatos.length > 0
            ? candidatos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0]
            : null;

        const dashboardData = {
            horasPracticas,
            horasTeoricas,
            examenesAprobados,
            proximaActividad
        };

        res.status(200).json(dashboardData);

    } catch (error) {
        console.error("Error al cargar el dashboard:", error);
        res.status(500).json({ message: "Error interno al cargar el inicio." });
    }
};