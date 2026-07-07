"use strict";
import Joi from "joi";
//validacion de creacion de clase teorica
export const crearClaseTeoricaValidation=Joi.object({
    titulo_clase:Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
        "string.base":"El titulo de la clase no puede estar vacio",
        "any.required":"el titulo es obligatorio",
        "string.min":"el titulo debe al menos tener 3 caracteres",
        "string.max":"el titulo no puede exceder el limite de 50 caracteres"
    }),
//validacion de fecha y hora
    fecha_hora:Joi.date()
    .required()
    .messages({
        "date.base":"la fecha debe ser valida",
        "any.required":"la fecha es obligatoria"
    }),
//validacion de id_profesor
    id_profesor:Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
        "number.base":"El Id del profesor debe ser un numero",
        "number.integer":"El Id del profesor debe ser un numero entero",
        "number.positive":"El Id del profesor debe ser un numero positivo",
        "any.required":"El Id del profesor es obligatorio"
    })
})