"use strict";
import { AppDataSource } from "../config/configDb.js";
import { Reserva } from "../entities/reservas.entity.js";
import { User } from "../entities/user.entity.js";
import { sendReservaConfirmationEmail } from "./mail.services.js";

export const createReservaService = async (fecha, hora, userId) => {
    const reservaRepository = AppDataSource.getRepository(Reserva);
    const userRepository = AppDataSource.getRepository(User);

    const existente = await reservaRepository.findOne({ where: { fecha, hora } });
    if (existente) {
        throw { status: 400, message: "Este horario ya fue reservado" };
    }

    const nuevaReserva = reservaRepository.create({
        fecha,
        hora,
        user: { id: userId }
    });

    await reservaRepository.save(nuevaReserva);


    userRepository.findOne({ where: { id: userId } })
        .then(alumno => {
            if (alumno && alumno.email) {
                sendReservaConfirmationEmail(alumno.email, alumno.nombre, fecha, hora);
            }
        })
        .catch(err => console.error("Error al buscar usuario para enviar correo de reserva:", err));

    return nuevaReserva;
};

export const getReservasByFechaService = async (fecha) => {
    const reservaRepository = AppDataSource.getRepository(Reserva);
    return await reservaRepository.find({
        where: { fecha: fecha },
        relations: ["user"]
    });
};