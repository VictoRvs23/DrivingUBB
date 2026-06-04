"use strict";
import { 
    preRegisterUser, 
    approveUserService, 
    getPendingUsersService, 
    rejectUserService 
} from "../services/user.services.js";

export const preRegister = async (req, res) => {
    try {
        await preRegisterUser(req.body);
        res.status(201).json({ 
            message: "Solicitud enviada con éxito. Un administrador revisará tu perfil." 
        });
    } catch (error) {
        console.error("Error en pre-registro:", error);
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al enviar la solicitud" });
    }
};

export const approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await approveUserService(id);
        
        res.status(200).json({ 
            message: `Usuario aprobado. Se ha enviado la clave al correo ${result.email}.` 
        });
    } catch (error) {
        console.error("Error al aprobar usuario:", error);
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error interno al aprobar" });
    }
};

export const getPendingUsers = async (req, res) => {
    try {
        const pending = await getPendingUsersService();
        res.status(200).json(pending);
    } catch (error) {
        console.error("Error al obtener solicitudes pendientes:", error);
        res.status(500).json({ message: "Error al obtener solicitudes" });
    }
};

export const rejectUser = async (req, res) => {
    try {
        const { id } = req.params;
        await rejectUserService(id);
        res.status(200).json({ message: "Solicitud rechazada y eliminada correctamente" });
    } catch (error) {
        console.error("Error al rechazar usuario:", error);
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al rechazar usuario" });
    }
};