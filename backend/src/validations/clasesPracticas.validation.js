import Joi from "joi";

export const crearClaseSchema = Joi.object({
  numero_clase: Joi.number().integer().required(),
  tema: Joi.string().max(150).required(),
  fecha_hora: Joi.date().iso().required(),
});

export const asignarRecursosSchema = Joi.object({
  instructor_id: Joi.number().integer().required(),
  vehiculo_id: Joi.number().integer().required(),
});

export const calificarClaseSchema = Joi.object({
  calificacion: Joi.number().min(1.0).max(7.0).precision(1).required(),
});