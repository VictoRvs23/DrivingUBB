import Joi from "joi";

// Lista de tipos permitidos
const tiposSoporte = ["Duda", "Error", "Reclamo", "Sugerencia"];

export const soporteValidation = Joi.object({
    tipo: Joi.string().valid(...tiposSoporte).required(),
    titulo: Joi.string().min(5).max(150).required(),
    descripcion: Joi.string().min(10).required(),
    imagen_adjunta: Joi.any().optional() // Es opcional, manejado por Multer
});

export const respuestaValidation = Joi.object({
    respuesta_admin: Joi.string().min(5).required()
});