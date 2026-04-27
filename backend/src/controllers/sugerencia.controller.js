"use strict";
import { AppDataSource } from "../config/configDb.js";
import { Sugerencia } from "../entities/sugerencia.entity.js";

const sugerenciaRepo = AppDataSource.getRepository(Sugerencia);

export const createSugerencia = async (req, res) => {
    try {
        const nuevaSugerencia = sugerenciaRepo.create({ 
            ...req.body, 
            usuario: { id: req.user.id } 
        });
        await sugerenciaRepo.save(nuevaSugerencia);
        res.status(201).json({ message: "Sugerencia enviada con éxito", data: nuevaSugerencia });
    } catch (error) { 
        res.status(500).json({ message: "Error al crear la sugerencia", error: error.message }); 
    }
};

export const getMisSugerencias = async (req, res) => {
    try {
        const sugerencias = await sugerenciaRepo.find({ 
            where: { usuario: { id: req.user.id } }, 
            order: { created_at: "DESC" } 
        });
        res.status(200).json(sugerencias);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tus sugerencias" });
    }
};

export const getAllSugerencias = async (req, res) => {
    try {
        const sugerencias = await sugerenciaRepo.find({ 
            relations: ["usuario"], 
            order: { created_at: "DESC" },
            select: { usuario: { id: true, nombre: true, email: true } }
        });
        res.status(200).json(sugerencias);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener todas las sugerencias" });
    }
};

export const deleteSugerencia = async (req, res) => {
    try {
        await sugerenciaRepo.delete(req.params.id);
        res.status(200).json({ message: "Sugerencia eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la sugerencia" });
    }
};