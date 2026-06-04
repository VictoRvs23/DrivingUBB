"use strict";
import { createReservaService, getReservasByFechaService } from "../services/reservas.services.js";

export const createReserva = async (req, res) => {
    try {
        const { fecha, hora } = req.body;
        const userId = req.user.id; 

        await createReservaService(fecha, hora, userId);

        res.status(201).json({ 
            message: "Reserva creada con éxito y correo de confirmación enviado" 
        });
    } catch (error) {
        console.error("Error al crear reserva:", error);
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error interno al procesar la reserva" });
    }
};

export const getReservasByFecha = async (req, res) => {
    try {
        const { fecha } = req.query;
        const reservas = await getReservasByFechaService(fecha);
        
        res.status(200).json(reservas);
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        res.status(500).json({ message: "Error al obtener las reservas del día" });
    }
};