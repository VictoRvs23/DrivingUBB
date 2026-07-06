"use strict";
import * as userService from "../services/user.services.js";

export const preRegister = async (req, res) => {
    try {
        await userService.createPreRegisterService(req.body);
        res.status(201).json({ message: "Solicitud enviada con éxito. Un administrador revisará tu perfil." });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error en preRegister:", error);
        res.status(500).json({ message: "Error interno al enviar la solicitud" });
    }
};

export const approveUser = async (req, res) => {
    try {
        const user = await userService.approveUserService(req.params.id);
        res.status(200).json({ message: `Usuario aprobado. Se ha enviado la clave al correo ${user.email}.` });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error en approveUser:", error);
        res.status(500).json({ message: "Error interno al aprobar" });
    }
};

export const getPendingUsers = async (req, res) => {
    try {
        const pending = await userService.getPendingUsersService();
        res.status(200).json(pending);
    } catch (error) {
        console.error("Error en getPendingUsers:", error);
        res.status(500).json({ message: "Error interno al obtener solicitudes" });
    }
};

export const rejectUser = async (req, res) => {
    try {
        await userService.rejectUserService(req.params.id);
        res.status(200).json({ message: "Solicitud rechazada y marcada como Reprobada" });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error en rejectUser:", error);
        res.status(500).json({ message: "Error interno al rechazar" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsersService(req.query.rol, req.query.busqueda);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error en getUsers:", error);
        res.status(500).json({ message: "Error interno al obtener usuarios" });
    }
};

export const createUser = async (req, res) => {
    try {
        const newUser = await userService.createUserService(req.body);
        res.status(201).json({ 
            message: "Usuario creado exitosamente", 
            user: { nombre: newUser.nombre, email: newUser.email, role: newUser.role, estado: newUser.estado } 
        });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error en createUser:", error);
        res.status(500).json({ message: "Error interno al crear el usuario" });
    }
};

export const updateUser = async (req, res) => {
    try {
        await userService.updateUserService(req.params.id, req.body);
        res.status(200).json({ message: "Usuario actualizado" });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error en updateUser:", error);
        res.status(500).json({ message: "Error interno al actualizar" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await userService.deleteUserService(req.params.id);
        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error en deleteUser:", error);
        res.status(500).json({ message: "Error interno al eliminar" });
    }
};