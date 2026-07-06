import { AppDataSource } from "../config/configDb.js"; 
import { ClasePractica } from "../entities/clasesPracticas.entity.js";
import { User } from "../entities/user.entity.js";

export const getDashboardInstructor = async (req, res) => {
    try {
        const userId = req.user.id;
        const claseRepository = AppDataSource.getRepository(ClasePractica);
        const misClases = await claseRepository.find({
            where: { instructor: { id: userId } },
            relations: ["user"],
            order: { fecha_hora: "ASC" }
        });

        const hoy = new Date();
        const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59);
        const clasesHoy = misClases.filter(clase => {
            const fechaClase = new Date(clase.fecha_hora);
            return fechaClase >= inicioHoy && fechaClase <= finHoy;
        }).length;

        const evaluacionesPendientes = misClases.filter(clase => 
            clase.estado === "Pendiente" 
        ).length;

        const proximasClases = misClases
            .filter(clase => new Date(clase.fecha_hora) >= hoy)
            .slice(0, 5)
            .map(clase => ({
                id: clase.id,
                titulo: `Clase n°${clase.numero_clase}: ${clase.tema}`,
                fecha: new Date(clase.fecha_hora).toLocaleString('es-CL', {
                    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit'
                }),
                alumno: clase.user ? clase.user.nombre : "Sin asignar"
            }));

        res.status(200).json({
            clasesHoy,
            evaluacionesPendientes,
            proximasClases
        });

    } catch (error) {
        console.error("Error al cargar el dashboard del instructor:", error);
        res.status(500).json({ message: "Error interno al cargar el inicio." });
    }
};