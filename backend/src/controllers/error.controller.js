"use strict";
import { AppDataSource } from "../config/configDb.js";
import { ReporteError } from "../entities/error.entity.js";

const errorRepo = AppDataSource.getRepository(ReporteError);

export const createError = async (req, res) => {
    try {
        const nuevoError = errorRepo.create({ 
            ...req.body, 
            usuario: { id: req.user.id } 
        });
        await errorRepo.save(nuevoError);
        res.status(201).json({ message: "Reporte de error enviado con éxito", data: nuevoError });
    } catch (error) { 
        res.status(500).json({ message: "Error al crear el reporte de error", error: error.message }); 
    }
};

export const getMisErrores = async (req, res) => {
    try {
        const errores = await errorRepo.find({ 
            where: { usuario: { id: req.user.id } }, 
            order: { created_at: "DESC" } 
        });
        res.status(200).json(errores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tus reportes de error" });
    }
};

export const getAllErrores = async (req, res) => {
    try {
        const errores = await errorRepo.find({ 
            relations: ["usuario"], 
            order: { created_at: "DESC" },
            select: { usuario: { id: true, nombre: true, email: true } }
        });
        res.status(200).json(errores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener todos los reportes de error" });
    }
};

export const responderError = async (req, res) => {
    try {
        const { id } = req.params;
        const { respuesta_admin } = req.body;
        
        const errorToUpdate = await errorRepo.findOneBy({ id: parseInt(id) });
        if (!errorToUpdate) return res.status(404).json({ message: "Reporte no encontrado" });

        await errorRepo.update(id, { respuesta_admin, estado: "respondido" });
        res.status(200).json({ message: "Respuesta enviada al reporte de error" });
    } catch (error) {
        res.status(500).json({ message: "Error al responder el reporte" });
    }
};

export const deleteError = async (req, res) => {
    try {
        await errorRepo.delete(req.params.id);
        res.status(200).json({ message: "Reporte de error eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el reporte" });
    }
};