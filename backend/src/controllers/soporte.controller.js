"use strict";
import path from "path";
import { HOST, PORT } from "../config/configEnv.js";
import {
    createSoporteService,
    getMisSoportesService,
    getAllSoportesService,
    responderSoporteService,
    eliminarSoporteService
} from "../services/soporte.service.js";

export const createSoporte = async (req, res) => {
    try {
        let imagen_adjunta = null;

        if (req.file) {
            const baseUrl = `http://${HOST}:${PORT}/api/src/upload/`;
            imagen_adjunta = baseUrl + path.basename(req.file.path);
        }

        const [nuevoSoporte, error] = await createSoporteService(req.body, req.user.id, imagen_adjunta);
        
        if (error) return res.status(400).json({ message: error });
        res.status(201).json({ message: "Soporte enviado con éxito", data: nuevoSoporte });
    } catch (error) {
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

export const getMisSoportes = async (req, res) => {
    const [soportes, error] = await getMisSoportesService(req.user.id);
    if (error) return res.status(500).json({ message: error });
    res.status(200).json(soportes);
};

export const getAllSoportes = async (req, res) => {
    const [soportes, error] = await getAllSoportesService();
    if (error) return res.status(500).json({ message: error });
    res.status(200).json(soportes);
};

export const responderSoporte = async (req, res) => {
    const { id } = req.params;
    const { respuesta_admin } = req.body;

    const [soporte, error] = await responderSoporteService(id, respuesta_admin);
    if (error) return res.status(400).json({ message: error });
    
    res.status(200).json({ message: "Respuesta enviada con éxito", data: soporte });
};

export const deleteSoporte = async (req, res) => {
    const { id } = req.params;
    const [soporte, error] = await eliminarSoporteService(id);
    
    if (error) return res.status(400).json({ message: error });
    res.status(200).json({ message: "Soporte cambiado a estado 'eliminado'", data: soporte });
};