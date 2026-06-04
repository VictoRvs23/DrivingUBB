"use strict";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendApprovalEmail } from "./mail.services.js";

const getUserRepository = () => AppDataSource.getRepository(User);

export const preRegisterUser = async (userData) => {
    const userRepository = getUserRepository();
    const { nombre, email, numeroTelefonico, rut } = userData;

    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
        throw { status: 400, message: "Este correo ya envió una solicitud o ya está registrado." };
    }

    const newUser = userRepository.create({
        nombre,
        email,
        numeroTelefonico,
        rut,
        role: "alumno",
        isApproved: false
    });

    return await userRepository.save(newUser);
};

export const approveUserService = async (id) => {
    const userRepository = getUserRepository();
    const user = await userRepository.findOneBy({ id: parseInt(id) });

    if (!user) {
        throw { status: 404, message: "Usuario no encontrado" };
    }

    if (user.isApproved) {
        throw { status: 400, message: "Este usuario ya ha sido aprobado anteriormente" };
    }


    const tempPassword = crypto.randomBytes(4).toString('hex');
    user.password = await bcrypt.hash(tempPassword, 10);
    user.isApproved = true;

    await userRepository.save(user);

    try {

        await sendApprovalEmail(user.email, user.nombre, tempPassword);
    } catch (mailError) {
        console.error("=> Error crítico al enviar el correo de aprobación:", mailError);
        
        user.isApproved = false;
        user.password = null; 
        await userRepository.save(user);

        throw { 
            status: 500, 
            message: "El usuario no pudo ser aprobado porque falló el envío del correo de bienvenida. Inténtalo nuevamente." 
        };
    }

    return { email: user.email, tempPassword };
};

export const getPendingUsersService = async () => {
    const userRepository = getUserRepository();
    return await userRepository.find({
        where: { isApproved: false },
        order: { created_at: "DESC" }
    });
};

export const rejectUserService = async (id) => {
    const userRepository = getUserRepository();
    const deleteResult = await userRepository.delete(id);

    if (deleteResult.affected === 0) {
        throw { status: 404, message: "Solicitud no encontrada" };
    }
    return true;
};