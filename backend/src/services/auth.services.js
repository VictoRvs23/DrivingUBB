import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/configEnv.js";

const userRepository = AppDataSource.getRepository(User);

export const loginService = async ({ email, password }) => {
    const user = await userRepository.findOneBy({ email });
    if (!user) {
        throw { status: 404, message: "Usuario no encontrado" };
    }

    if (user.estado === "Inactivo" || user.estado === "Reprobado") {
        throw { status: 403, message: "Tu solicitud de ingreso aún no ha sido aprobada o fue rechazada" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw { status: 401, message: "Contraseña incorrecta" };
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, nombre: user.nombre },
        JWT_SECRET,
        { expiresIn: "1d" } 
    );

    return { 
        token, 
        user: { nombre: user.nombre, role: user.role, email: user.email } 
    };
};