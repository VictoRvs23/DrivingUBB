import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { ILike, In } from "typeorm";
import { sendApprovalEmail } from "./mail.services.js";

const userRepository = AppDataSource.getRepository(User);

export const createPreRegisterService = async (data) => {
    const existingUser = await userRepository.findOneBy({ email: data.email });
    if (existingUser) {
        throw { status: 400, message: "Este correo ya envió una solicitud o ya está registrado." };
    }
    const newUser = userRepository.create({ ...data, role: "alumno", estado: "Inactivo" });
    return await userRepository.save(newUser);
};

export const approveUserService = async (id) => {
    const user = await userRepository.findOneBy({ id: parseInt(id) });
    if (!user || user.estado === "Aprobado" || user.estado === "Activo") {
        throw { status: 400, message: "Usuario no válido para aprobación" };
    }

    const tempPassword = crypto.randomBytes(4).toString('hex');
    user.password = await bcrypt.hash(tempPassword, 10);
    user.estado = "Aprobado";
    await userRepository.save(user);

    try {
        await sendApprovalEmail(user.email, user.nombre, tempPassword);
        console.log(`=> CORREO ENVIADO A ${user.email}. Clave temporal: ${tempPassword}`);
    } catch (mailError) {
        console.error("=> Error al enviar el correo, pero el usuario fue aprobado:", mailError);
    }
    return user;
};

export const getPendingUsersService = async () => {
    return await userRepository.find({
        where: { estado: "Inactivo" },
        order: { created_at: "DESC" }
    });
};

export const rejectUserService = async (id) => {
    const user = await userRepository.findOneBy({ id: parseInt(id) });
    if (!user) throw { status: 404, message: "Usuario no encontrado" };
    user.estado = "Reprobado";
    await userRepository.save(user);
    return true;
};

export const getUsersService = async (rol, busqueda) => {
    const condiciones = {}; 
    
    if (rol) condiciones.role = rol;
    if (busqueda) condiciones.nombre = ILike(`%${busqueda}%`);

    return await userRepository.find({
        where: condiciones,
        order: { created_at: "DESC" },
        select: ["id", "nombre", "run", "email", "numeroTelefonico", "role", "estado"]
    });
};

export const createUserService = async (data) => {
    const existingUser = await userRepository.findOne({
        where: [{ email: data.email }, { run: data.run }]
    });

    if (existingUser) throw { status: 400, message: "El usuario ya existe." };

    const hashedPw = await bcrypt.hash(data.password, 10);
    const newUser = userRepository.create({
        ...data,
        password: hashedPw,
        estado: "Activo"
    });

    return await userRepository.save(newUser);
};

export const updateUserService = async (id, data) => {
    const user = await userRepository.findOneBy({ id: parseInt(id) });
    if (!user) throw { status: 404, message: "Usuario no encontrado" };
    
    if(data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    
    await userRepository.update(id, data);
    return true;
};

export const deleteUserService = async (id) => {
    const user = await userRepository.findOneBy({ id: parseInt(id) });
    if (!user) throw { status: 404, message: "Usuario no encontrado" };
    await userRepository.delete(id);
    return true;
};