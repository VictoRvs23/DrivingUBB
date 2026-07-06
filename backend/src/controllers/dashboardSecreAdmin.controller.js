import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Soporte } from "../entities/soporte.entity.js"; 

export const getDashboardAdmin = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const soporteRepository = AppDataSource.getRepository(Soporte);
        const usuariosTotales = await userRepository.count();
        const hoy = new Date();
        const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        
        const nuevosHoy = await userRepository.createQueryBuilder("user")
            .where("user.created_at >= :inicioHoy", { inicioHoy })
            .getCount();

        const ticketsPendientes = await soporteRepository.count({
            where: { estado: "sin respuesta" }
        });

        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const resueltosMes = await soporteRepository.createQueryBuilder("soporte")
            .where("soporte.estado = :estado", { estado: "respondido" })
            .andWhere("soporte.updated_at >= :inicioMes", { inicioMes })
            .getCount();

        const ultimosTickets = await soporteRepository.find({
            order: { created_at: "DESC" },
            take: 5,
            relations: ["usuario"]
        });

        const ticketsRecientes = ultimosTickets.map(ticket => {
            let estadoVisual = 'Pendiente';
            if (ticket.estado === 'respondido') estadoVisual = 'Resuelto';
            if (ticket.estado === 'eliminado') estadoVisual = 'Cerrado';
            let tipoVisual = 'pregunta';
            if (ticket.tipo === 'Error' || ticket.tipo === 'Reclamo') tipoVisual = 'tecnico';

            return {
                id: ticket.id,
                tipo: tipoVisual, 
                usuario: ticket.usuario ? ticket.usuario.nombre : "Anónimo",
                estado: estadoVisual,
                fecha: new Date(ticket.created_at).toLocaleDateString('es-CL')
            };
        });

        res.status(200).json({
            usuariosTotales,
            nuevosHoy,
            ticketsPendientes, 
            resueltosMes,      
            ticketsRecientes
        });

    } catch (error) {
        console.error("Error al cargar el dashboard de Admin:", error);
        res.status(500).json({ message: "Error interno al cargar el panel de control." });
    }
};