"use strict";
import * as faqService from "../services/preguntaFrecuente.service.js";

export const getFAQs = async (req, res) => {
    try {
        const faqs = await faqService.getFAQsService();
        res.status(200).json(faqs);
    } catch (error) {
        console.error("Error al obtener preguntas frecuentes:", error);
        res.status(500).json({ message: "Error interno al obtener las preguntas frecuentes" });
    }
};

export const createFAQ = async (req, res) => {
    try {
        const nuevaFaq = await faqService.createFAQService(req.body);
        res.status(201).json({ message: "Pregunta frecuente creada con éxito", data: nuevaFaq });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error al crear pregunta frecuente:", error);
        res.status(500).json({ message: "Error interno al crear la pregunta frecuente" });
    }
};

export const updateFAQ = async (req, res) => {
    try {
        const faqActualizada = await faqService.updateFAQService(req.params.id, req.body);
        res.status(200).json({ message: "Pregunta frecuente actualizada con éxito", data: faqActualizada });
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error al actualizar pregunta frecuente:", error);
        res.status(500).json({ message: "Error interno al actualizar la pregunta frecuente" });
    }
};

export const deleteFAQ = async (req, res) => {
    try {
        const result = await faqService.deleteFAQService(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        if (error.status) return res.status(error.status).json({ message: error.message });
        console.error("Error al eliminar pregunta frecuente:", error);
        res.status(500).json({ message: "Error interno al eliminar la pregunta frecuente" });
    }
};