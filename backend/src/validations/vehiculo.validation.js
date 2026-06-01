import Joi from "joi";

export const vehiculoBodySchema = Joi.object({
  numeroMovil: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El número de móvil debe ser un valor numérico.",
      "any.required": "El número de móvil (n° Vehículo) es obligatorio."
    }),
    
  patente: Joi.string()
    .required()
    .trim()
    .pattern(/^[A-Z]{2,4}[0-9]{2,4}$/)
    .messages({
      "string.pattern.base": "La patente debe tener un formato válido sin guiones ni espacios (ej: ABCD12 o AB1234).",
      "string.empty": "La patente no puede estar vacía.",
      "any.required": "La patente es obligatoria."
    }),
    
  estado: Joi.string()
    .valid("Disponible", "Mantencion", "En Ruta")
    .default("Disponible")
    .messages({
      "any.only": "El estado debe ser estrictamente 'Disponible', 'Mantención' o 'En Ruta'."
    }),
    
  permiso_circulacion: Joi.string()
    .max(50)
    .optional()
    .allow("")
    .messages({
      "string.max": "El texto del permiso de circulación es muy largo."
    }),
    
  revision_tecnica: Joi.string()
    .max(50)
    .optional()
    .allow("")
    .messages({
      "string.max": "El texto de la revisión técnica es muy largo."
    })
    
}).messages({
  "object.unknown": "No se permiten campos adicionales en este formulario."
});