import * as clasesTeoricasService from "../services/clasesTeoricas.services.js";
import { claseTeoricaBodySchema } from "../validations/clasesTeoricas.validation.js";

export const getClasesTeoricas = async (req, res) => {
  try {
    const clases = await clasesTeoricasService.getClasesTeoricasService();
    res.status(200).json(clases);
  } catch (error) {
    console.error("Error al obtener clases teóricas:", error);
    res.status(500).json({ mensaje: "Error interno al obtener las clases teóricas" });
  }
};

export const getMisClasesTeoricas = async (req, res) => {
  try {
    const clases = await clasesTeoricasService.getClasesTeoricasInstructorService(req.user.id);
    res.status(200).json(clases);
  } catch (error) {
    console.error("Error al obtener mis clases teóricas:", error);
    res.status(500).json({ mensaje: "Error interno al obtener tus clases teóricas" });
  }
};

export const createClaseTeorica = async (req, res) => {
  try {
    const { error, value } = claseTeoricaBodySchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ mensaje: "Error de validación", errores: error.details.map(e => e.message) });
    }

    value.profesor = { id: req.user.id };

    const nuevaClase = await clasesTeoricasService.createClaseTeoricaService(value);
    res.status(201).json(nuevaClase);
  } catch (error) {
    console.error("Error al crear la clase teórica:", error);
    res.status(500).json({ mensaje: "Error interno al crear la clase teórica" });
  }
};

export const updateClaseTeorica = async (req, res) => {
  try {
    const { error, value } = claseTeoricaBodySchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ mensaje: "Error de validación", errores: error.details.map(e => e.message) });
    }

    await clasesTeoricasService.updateClaseTeoricaService(req.params.id, req.user.id, value);
    res.status(200).json({ mensaje: "Clase teórica actualizada con éxito" });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    console.error("Error al actualizar la clase teórica:", error);
    res.status(500).json({ mensaje: "Error interno al actualizar la clase teórica" });
  }
};

export const deleteClaseTeorica = async (req, res) => {
  try {
    await clasesTeoricasService.deleteClaseTeoricaService(req.params.id, req.user.id);
    res.status(200).json({ mensaje: "Clase teórica eliminada con éxito" });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    console.error("Error al eliminar la clase teórica:", error);
    res.status(500).json({ mensaje: "Error interno al eliminar la clase teórica" });
  }
};