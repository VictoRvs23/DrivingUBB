"use strict";
import { AppDataSource } from "../config/configDb.js";
import { PreguntaFrecuente } from "../entities/preguntaFrecuente.entity.js";

const faqRepository = AppDataSource.getRepository(PreguntaFrecuente);

export const getFAQsService = async () => {
    return await faqRepository.find({ order: { id: "ASC" } });
};

export const createFAQService = async (data) => {
    // Verificar el límite de 4 preguntas
    const count = await faqRepository.count();
    if (count >= 4) {
        throw { status: 400, message: "Límite alcanzado: Solo puede haber un máximo de 4 preguntas frecuentes activas." };
    }

    const nuevaFaq = faqRepository.create(data);
    return await faqRepository.save(nuevaFaq);
};

export const updateFAQService = async (id, data) => {
    const faq = await faqRepository.findOneBy({ id: parseInt(id) });
    
    if (!faq) {
        throw { status: 404, message: "Pregunta frecuente no encontrada." };
    }

    if (data.pregunta) faq.pregunta = data.pregunta;
    if (data.respuesta) faq.respuesta = data.respuesta;

    return await faqRepository.save(faq);
};

export const deleteFAQService = async (id) => {
    const faq = await faqRepository.findOneBy({ id: parseInt(id) });
    if (!faq) {
        throw { status: 404, message: "Pregunta frecuente no encontrada." };
    }
    
    await faqRepository.remove(faq);
    return { message: "Pregunta frecuente eliminada con éxito." };
};