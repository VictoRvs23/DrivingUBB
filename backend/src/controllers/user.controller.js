"use strict";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";
import crypto from "crypto"; 


export const preRegister = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { nombre, email, numeroTelefonico } = req.body;

        // verifica el correo nomas
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Este correo ya envió una solicitud o ya está registrado." });
        }

        const newUser = userRepository.create({
            nombre,
            email,
            numeroTelefonico,
            role: "alumno",
            isApproved: false 
        });

        await userRepository.save(newUser);
        res.status(201).json({ 
            message: "Solicitud enviada con éxito. Un administrador revisará tu perfil." 
        });
    } catch (error) {
        console.error("Error en pre-registro:", error);
        res.status(500).json({ message: "Error al enviar la solicitud" });
    }
};

export const approveUser = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;

        const user = await userRepository.findOneBy({ id: parseInt(id) });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (user.isApproved) {
            return res.status(400).json({ message: "Este usuario ya ha sido aprobado anteriormente" });
        }

        const tempPassword = crypto.randomBytes(4).toString('hex');
        
        user.password = await bcrypt.hash(tempPassword, 10);
        user.isApproved = true;

        await userRepository.save(user);

        // correo (debo configurarlo luego porque ahora no tengo todavia puesto nada)
        console.log(`=> CORREO ENVIADO A ${user.email}. Contraseña temporal: ${tempPassword}`);

        res.status(200).json({ 
            message: `Usuario aprobado. Se ha enviado la clave '${tempPassword}' al correo.` 
        });
    } catch (error) {
        console.error("Error al aprobar usuario:", error);
        res.status(500).json({ message: "Error interno al aprobar" });
    }
};

// solictudes pendientes
export const getPendingUsers = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const pending = await userRepository.find({
            where: { isApproved: false },
            order: { created_at: "DESC" }
        });
        res.status(200).json(pending);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener solicitudes" });
    }
};  

export const rejectUser = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;
        await userRepository.delete(id);
        res.status(200).json({ message: "Solicitud rechazada y eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al rechazar usuario" });
    }
};