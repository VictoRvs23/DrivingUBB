"use strict";
import Joi from "joi";

export const preguntaFrecuenteSchema = Joi.object({
  pregunta: Joi.string().min(5).max(255).required().messages({
    "string.empty": "La pregunta no puede estar vacía.",
    "any.required": "La pregunta es obligatoria.",
  }),
  respuesta: Joi.string().min(5).required().messages({
    "string.empty": "La respuesta no puede estar vacía.",
    "any.required": "La respuesta es obligatoria.",
  }),
});

export const updatePreguntaFrecuenteSchema = Joi.object({
  pregunta: Joi.string().min(5).max(255).messages({
    "string.empty": "La pregunta no puede estar vacía.",
    "string.min": "La pregunta debe tener al menos 5 caracteres."
  }),
  respuesta: Joi.string().min(5).messages({
    "string.empty": "La respuesta no puede estar vacía.",
    "string.min": "La respuesta debe tener al menos 5 caracteres."
  })
}).min(1).messages({
  "object.min": "Debes enviar al menos un campo para actualizar (pregunta o respuesta)."
});