"use strict";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";
import crypto from "crypto"; 
import { ILike } from "typeorm"; 
import { sendApprovalEmail } from "../services/mail.services.js";


export const preRegister = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { nombre, email, numeroTelefonico, rut } = req.body;
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: "Este correo ya envió una solicitud o ya está registrado." 
            });
        }
        const newUser = userRepository.create({
            nombre,
            email,
            numeroTelefonico,
            rut,
            role: "alumno",
            isApproved: false 
        });
        await userRepository.save(newUser);
        
        console.log(`=> Nuevo pre-registro exitoso: ${email}`);
        
        res.status(201).json({ 
            message: "Solicitud enviada con éxito. Un administrador revisará tu perfil." 
        });
    } catch (error) {
        res.status(500).json({ message: "Error al enviar la solicitud" });
    }
};

export const approveUser = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;
        const user = await userRepository.findOneBy({ id: parseInt(id) });
        if (!user || user.isApproved) return res.status(400).json({ message: "Usuario no válido para aprobación" });

        const tempPassword = crypto.randomBytes(4).toString('hex');
        user.password = await bcrypt.hash(tempPassword, 10);
        user.isApproved = true;
        await userRepository.save(user);

        try {
            await sendApprovalEmail(user.email, user.nombre, tempPassword);
            console.log(`=> CORREO ENVIADO A ${user.email}. Clave temporal: ${tempPassword}`);
        } catch (mailError) {
            console.error("=> Error al enviar el correo, pero el usuario fue aprobado:", mailError);
        }

        res.status(200).json({ 
            message: `Usuario aprobado. Se ha enviado la clave al correo ${user.email}.` 
        });
    } catch (error) {
        res.status(500).json({ message: "Error al aprobar" });
    }
};

export const getPendingUsers = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        
        const pending = await userRepository.find({
            where: { isApproved: false },
            order: { created_at: "DESC" }
        });
        
        res.status(200).json(pending);
    } catch (error) {
        console.error("Error al obtener solicitudes pendientes:", error);
        res.status(500).json({ message: "Error al obtener solicitudes" });
    }
};  

export const rejectUser = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;
        await userRepository.delete(id);
        res.status(200).json({ message: "Solicitud rechazada" });
    } catch (error) {
        res.status(500).json({ message: "Error al rechazar" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { rol, busqueda } = req.query;
        const condiciones = { isApproved: true };

        if (rol) condiciones.role = rol;
        if (busqueda) condiciones.nombre = ILike(`%${busqueda}%`);

        const users = await userRepository.find({
            where: condiciones,
            order: { created_at: "DESC" },
            select: ["id", "nombre", "run", "email", "numeroTelefonico", "role", "isApproved"]
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

export const createUser = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { nombre, run, email, password, role, numeroTelefonico } = req.body;

        const hashedPw = await bcrypt.hash(password, 10);
        const newUser = userRepository.create({
            nombre, run, email,
            password: hashedPw,
            role,
            numeroTelefonico,
            isApproved: true
        });

        await userRepository.save(newUser);
        res.status(201).json({ message: "Usuario creado exitosamente", user: { nombre, email, role } });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el usuario" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;
        await userRepository.update(id, req.body);
        res.status(200).json({ message: "Usuario actualizado" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const { id } = req.params;
        await userRepository.delete(id);
        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar" });
    }
};