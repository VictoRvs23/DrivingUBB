import Joi from "joi";

const opciones = ["opción 1", "opción 2", "opción 3", "opción 4"];
const motivos = ["motivo 1", "motivo 2", "motivo 3", "motivo 4"];
const categorias = ["categoría 1", "categoría 2", "categoría 3", "categoría 4"];

export const dudaValidation = Joi.object({
    asunto: Joi.string().valid(...opciones).required(),
    mensaje: Joi.string().min(10).required()
});

export const errorValidation = Joi.object({
    titulo: Joi.string().required(),
    descripcion: Joi.string().required(),
    pasos_replicar: Joi.string().required(),
    adjunto_foto: Joi.string().optional()
});

export const reclamoValidation = Joi.object({
    motivo: Joi.string().valid(...motivos).required(),
    fecha_incidente: Joi.date().required(),
    detalles: Joi.string().required(),
    evidencia_foto: Joi.string().required() // Obligatorio
});

export const sugerenciaValidation = Joi.object({
    categoria: Joi.string().valid(...categorias).required(),
    descripcion_idea: Joi.string().required(),
    adjunto_idea: Joi.string().optional()
});

export const respuestaValidation = Joi.object({
    respuesta_admin: Joi.string().required()
});