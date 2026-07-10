import Joi from "joi";

export const claseTeoricaBodySchema = Joi.object({
  titulo_clase: Joi.string()
    .min(3)
    .max(150)
    .required()
    .messages({
      "string.empty": "El título de la clase es obligatorio.",
      "string.min": "El título debe tener al menos 3 caracteres.",
      "string.max": "El título no puede superar los 150 caracteres.",
      "any.required": "El título de la clase es obligatorio.",
    }),

  fecha_hora: Joi.date()
    .required()
    .messages({
      "date.base": "La fecha y hora no son válidas.",
      "any.required": "La fecha y hora son obligatorias.",
    }),

  enlace_videollamada: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required()
    .messages({
      "string.uri": "El enlace debe ser una URL válida (debe comenzar con http:// o https://).",
      "string.empty": "El enlace de la videollamada es obligatorio.",
      "any.required": "El enlace de la videollamada es obligatorio.",
    }),

  codigo_acceso: Joi.string()
    .allow('')
    .optional()
    .messages({
      "string.base": "El código de acceso debe ser un texto.",
    }),
});