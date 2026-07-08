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
    .valid("Disponible", "Mantencion", "En Ruta", "No Disponible")
    .default("Disponible")
    .messages({
      "any.only": "El estado debe ser estrictamente 'Disponible', 'Mantención', 'En Ruta' o 'No Disponible'."
    }),
    
  permiso_circulacion: Joi.string()
    .max(255)
    .optional()
    .allow("")
    .messages({
      "string.max": "El texto del permiso de circulación es muy largo."
    }),
    
  revision_tecnica: Joi.string()
    .max(255)
    .optional()
    .allow("")
    .messages({
      "string.max": "El texto de la revisión técnica es muy largo."
    }),

  vencimiento_permiso: Joi.string()
    .allow("", null)
    .optional()
    .messages({
      "string.base": "La fecha de vencimiento del permiso no es válida."
    }),

  vencimiento_revision: Joi.string()
    .allow("", null)
    .optional()
    .messages({
      "string.base": "La fecha de vencimiento de la revisión no es válida."
    }),

  quitar_permiso: Joi.string()
    .allow("", null)
    .optional(),

  quitar_revision: Joi.string()
    .allow("", null)
    .optional()
    
}).messages({
  "object.unknown": "No se permiten campos adicionales en este formulario."
});