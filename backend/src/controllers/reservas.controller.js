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

        // verifica que no este ocupado ese horario
        const existente = await reservaRepository.findOne({ where: { fecha, hora } });
        if (existente) {
            return res.status(400).json({ message: "Este horario ya fue reservado por otro usuario." });
        }

        const alumno = await userRepository.findOne({ where: { id: userId } });
        if (!alumno) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // se crea y guarda en la base de datos la clase
        const nuevaReserva = reservaRepository.create({
            fecha,
            hora,
            user: alumno
        });
        await reservaRepository.save(nuevaReserva);

        const fechaHoraCombinada = new Date(`${fecha}T${hora}:00`); 
        const nuevaClase = claseRepository.create({
            numero_clase: 0, 
            tema: "Clase Práctica",
            fecha_hora: fechaHoraCombinada,
            user: alumno,
            estado: "Pendiente"
        });
        await claseRepository.save(nuevaClase);

        // se obtienen las clases dsel alumno
        const clasesAlumno = await claseRepository.find({
            where: { user: { id: userId } },
            order: { fecha_hora: "ASC" }
        });

        // recorre la lista y ordena las clases
        for (let i = 0; i < clasesAlumno.length; i++) {
            const numeroSecuencial = i + 1;
            clasesAlumno[i].numero_clase = numeroSecuencial;
            clasesAlumno[i].tema = `Clase Práctica N°${numeroSecuencial}`;
        }

        // se guardan odos los datos 
        await claseRepository.save(clasesAlumno);
        
        
        if (alumno.email) {
            sendReservaConfirmationEmail(alumno.email, alumno.nombre, fecha, hora);
        }

        return res.status(201).json({ message: "Reserva y Clase Práctica procesadas y ordenadas crononológicamente con éxito." });

    } catch (error) {
        console.error("Error general al crear reserva:", error);
        return res.status(500).json({ 
            message: "Error interno al procesar la reserva",
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
        
        return res.status(200).json(reservas);
    } catch (error) {
        console.error("Error al obtener reservas por fecha:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};