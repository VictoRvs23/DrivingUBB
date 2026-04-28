"use strict";
import path from "path";
import { HOST, PORT } from "../config/configEnv.js";
import { AppDataSource } from "../config/configDb.js";
import { Reclamo } from "../entities/reclamo.entity.js";

const reclamoRepo = AppDataSource.getRepository(Reclamo);

export const createReclamo = async (req, res) => {
    try {

        let evidencia_foto = null;

        if (req.file) {
            const baseUrl = `http://${HOST}:${PORT}/api/src/upload/`;
            evidencia_foto = baseUrl + path.basename(req.file.path);
        }
        const nuevoReclamo = reclamoRepo.create({ 
            ...req.body, 
            evidencia_foto, 
            usuario: { id: req.user.id } 
        });
        await reclamoRepo.save(nuevoReclamo);
        res.status(201).json({ message: "Reclamo enviado con éxito", data: nuevoReclamo });
    } catch (error) { 
        res.status(500).json({ message: "Error al crear el reclamo", error: error.message }); 
    }
};

export const getMisReclamos = async (req, res) => {
    try {
        const reclamos = await reclamoRepo.find({ 
            where: { usuario: { id: req.user.id } }, 
            order: { created_at: "DESC" } 
        });
        res.status(200).json(reclamos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tus reclamos" });
    }
};

export const getAllReclamos = async (req, res) => {
    try {
        const reclamos = await reclamoRepo.find({ 
            relations: ["usuario"], 
            order: { created_at: "DESC" },
            select: { usuario: { id: true, nombre: true, email: true } }
        });
        res.status(200).json(reclamos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener todos los reclamos" });
    }
};

export const responderReclamo = async (req, res) => {
    try {
        const { id } = req.params;
        const { respuesta_admin } = req.body;
        
        const reclamoToUpdate = await reclamoRepo.findOneBy({ id: parseInt(id) });
        if (!reclamoToUpdate) return res.status(404).json({ message: "Reclamo no encontrado" });

        await reclamoRepo.update(id, { respuesta_admin, estado: "respondido" });
        res.status(200).json({ message: "Respuesta enviada al reclamo" });
    } catch (error) {
        res.status(500).json({ message: "Error al responder el reclamo" });
    }
};

export const deleteReclamo = async (req, res) => {
    try {
        await reclamoRepo.delete(req.params.id);
        res.status(200).json({ message: "Reclamo eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el reclamo" });
    }
};