"use strict";
import Joi from "joi";

export const preRegisterValidation = Joi.object({
  nombre: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "any.required": "El nombre es obligatorio.",
      "string.min": "El nombre debe tener al menos 2 caracteres.",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "El correo electrónico debe ser válido.",
      "any.required": "El correo es obligatorio.",
    }),
  numeroTelefonico: Joi.string()
    .length(9)
    .pattern(/^9[0-9]{8}$/)
    .required()
    .messages({
      "string.length": "El número debe tener exactamente 9 dígitos.",
      "string.pattern.base": "El número debe comenzar con 9 (Ej: 912345678).",
    }),
  role: Joi.string().valid("alumno", "instructor", "secretaria", "admin").optional()
})
.unknown(false);

export const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Ingresa un correo válido.",
    "any.required": "El correo es obligatorio."
  }),
  password: Joi.string().required().messages({
    "any.required": "La contraseña es obligatoria."
  }),
})
.unknown(false);