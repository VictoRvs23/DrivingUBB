"use strict";
import { AppDataSource } from "../config/configDb.js";
import { Reserva } from "../entities/reservas.entity.js";
import { User } from "../entities/user.entity.js"; 
import { sendReservaConfirmationEmail } from "../services/mail.services.js"; 

/**
 * Crea reserva y mnanda correo
 */
export const createReserva = async (req, res) => {
    try {
        const { fecha, hora } = req.body;
        const userId = req.user.id; 

        const reservaRepository = AppDataSource.getRepository(Reserva);
        const userRepository = AppDataSource.getRepository(User);

        const existente = await reservaRepository.findOne({ where: { fecha, hora } });
        if (existente) {
            return res.status(400).json({ message: "Este horario ya fue reservado" });
        }

        const nuevaReserva = reservaRepository.create({
            fecha,
            hora,
            user: { id: userId }
        });

        await reservaRepository.save(nuevaReserva);

        const alumno = await userRepository.findOne({ where: { id: userId } });
        
        if (alumno && alumno.email) {
            sendReservaConfirmationEmail(alumno.email, alumno.nombre, fecha, hora);
        }

        res.status(201).json({ 
            message: "Reserva creada con éxito y correo de confirmación enviado" 
        });

    } catch (error) {
        console.error("Error al crear reserva:", error);
        res.status(500).json({ message: "Error interno al procesar la reserva" });
    }
};

export const getReservasByFecha = async (req, res) => {
    try {
        const { fecha } = req.query;
        const reservaRepository = AppDataSource.getRepository(Reserva);
    
        const reservas = await reservaRepository.find({
            where: { fecha: fecha },
            relations: ["user"] 
        });
        
        res.status(200).json(reservas);
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        res.status(500).json({ message: "Error al obtener las reservas del día" });
    }
};