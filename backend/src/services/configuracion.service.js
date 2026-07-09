"use strict";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

const COOLDOWN_MS = 24 * 60 * 60 * 1000; 

export const changePasswordService = async (userId, oldPassword, newPassword) => {
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
        throw { status: 404, message: "Usuario no encontrado" };
    }

    if (user.password_changed_at) {
        const msPasados = Date.now() - new Date(user.password_changed_at).getTime();
        if (msPasados < COOLDOWN_MS) {
            const msRestantes  = COOLDOWN_MS - msPasados;
            const horasRestantes   = Math.floor(msRestantes / 3600000);
            const minutosRestantes = Math.floor((msRestantes % 3600000) / 60000);
            throw {
                status: 429,
                message: `Debes esperar ${horasRestantes}h ${minutosRestantes}m antes de volver a cambiar tu contraseña.`,
                cooldown: {
                    ms_restantes: msRestantes,
                    horas:   horasRestantes,
                    minutos: minutosRestantes,
                }
            };
        }
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw { status: 400, message: "La contraseña actual es incorrecta" };
    }

    user.password            = await bcrypt.hash(newPassword, 10);
    user.password_changed_at = new Date();
    await userRepository.save(user);

    return true;
};

export const toggleEmailPreferencesService = async (userId, recibirCorreos) => {
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
        throw { status: 404, message: "Usuario no encontrado" };
    }

    user.recibir_correos = recibirCorreos;
    await userRepository.save(user);

    return user.recibir_correos;
};
