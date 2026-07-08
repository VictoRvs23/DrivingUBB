"use strict";
import * as configService from "../services/configuracion.service.js";

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Las nuevas contraseñas no coinciden" });
        }

        await configService.changePasswordService(req.user.id, oldPassword, newPassword);
        
        res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error al cambiar contraseña:", error);
        res.status(500).json({ message: "Error interno al actualizar la contraseña" });
    }
};

export const toggleEmails = async (req, res) => {
    try {
        const { recibir_correos } = req.body; 

        if (typeof recibir_correos !== "boolean") {
            return res.status(400).json({ message: "El valor debe ser un booleano (true/false)" });
        }

        const estadoActualizado = await configService.toggleEmailPreferencesService(req.user.id, recibir_correos);
        
        const mensaje = estadoActualizado 
            ? "Envío de correos habilitado" 
            : "Envío de correos deshabilitado";

        res.status(200).json({ message: mensaje, recibir_correos: estadoActualizado });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error al configurar correos:", error);
        res.status(500).json({ message: "Error interno al actualizar configuración de correos" });
    }
};