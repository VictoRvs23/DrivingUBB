"use strict";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export const changePasswordService = async (userId, oldPassword, newPassword) => {
    const user = await userRepository.findOneBy({ id: userId });
    
    if (!user) {
        throw { status: 404, message: "Usuario no encontrado" };
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw { status: 400, message: "La contraseña actual es incorrecta" };
    }

    user.password = await bcrypt.hash(newPassword, 10);
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