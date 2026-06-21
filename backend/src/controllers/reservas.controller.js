"use strict";
import { AppDataSource } from "../config/configDb.js";
import { Reserva } from "../entities/reservas.entity.js";
import { User } from "../entities/user.entity.js"; 
import { ClasePractica } from "../entities/clasesPracticas.entity.js"; 
import { sendReservaConfirmationEmail } from "../services/mail.services.js"; 

export const createReserva = async (req, res) => {
    try {
        const { fecha, hora } = req.body;
        const userId = req.user.id; 

        if (!fecha || !hora) {
            return res.status(400).json({ message: "Faltan datos. Asegúrate de enviar 'fecha' y 'hora'." });
        }

        const reservaRepository = AppDataSource.getRepository(Reserva);
        const userRepository = AppDataSource.getRepository(User);
        const claseRepository = AppDataSource.getRepository(ClasePractica);

        const existente = await reservaRepository.findOne({ where: { fecha, hora } });
        if (existente) {
            return res.status(400).json({ message: "Este horario ya fue reservado" });
        }

        const alumno = await userRepository.findOne({ where: { id: userId } });
        if (!alumno) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const nuevaReserva = reservaRepository.create({
            fecha,
            hora,
            user: alumno 
        });
        await reservaRepository.save(nuevaReserva);

        const fechaLimpia = fecha.includes('T') ? fecha.split('T')[0] : fecha;
        const fechaHoraCombinada = new Date(`${fechaLimpia}T${hora}:00`); 
        const nuevaClase = claseRepository.create({
            numero_clase: 1,
            tema: "Clase Práctica Automática",
            fecha_hora: fechaHoraCombinada,
            user: alumno,
            estado: "Pendiente"
        });
        await claseRepository.save(nuevaClase);
        
        if (alumno.email) {
            sendReservaConfirmationEmail(alumno.email, alumno.nombre, fecha, hora);
        }

        return res.status(201).json({ message: "Reserva y Clase Práctica creadas con éxito" });

    } catch (error) {
        console.error("Error general al crear reserva:", error);
        return res.status(500).json({ 
            message: "Error interno al procesar",
            detalle_tecnico: error.message 
        });
    }
};

export const getReservasByFecha = async (req, res) => {
    try {
        const { fecha } = req.query;
        
        if (!fecha) {
            return res.status(400).json({ message: "Debe proporcionar una fecha en la URL" });
        }

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