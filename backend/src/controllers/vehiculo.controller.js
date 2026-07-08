import * as vehiculoService from "../services/vehiculo.services.js";
import { vehiculoBodySchema } from "../validations/vehiculo.validation.js"; 

export const getVehiculos = async (req, res) => {
  try {
    const vehiculos = await vehiculoService.getVehiculosService();
    res.status(200).json(vehiculos);
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    res.status(500).json({ mensaje: "Error interno al obtener vehículos" });
  }
};

export const createVehiculo = async (req, res) => {
  try {
    const { error, value } = vehiculoBodySchema.validate(req.body, { abortEarly: false, allowUnknown: true });
    if (error) {
      return res.status(400).json({ mensaje: "Error de validación", errores: error.details.map(e => e.message) });
    }

    value.vencimiento_permiso = req.body.vencimiento_permiso ? req.body.vencimiento_permiso : null;
    value.vencimiento_revision = req.body.vencimiento_revision ? req.body.vencimiento_revision : null;

    if (req.files?.permiso_circulacion) {
      value.permiso_circulacion = req.files.permiso_circulacion[0].filename;
    }
    if (req.files?.revision_tecnica) {
      value.revision_tecnica = req.files.revision_tecnica[0].filename;
    }

    const nuevoVehiculo = await vehiculoService.createVehiculoService(value);
    res.status(201).json(nuevoVehiculo);
  } catch (error) {
    console.error("Error al crear el vehículo:", error);
    res.status(500).json({ mensaje: "Error interno al crear el vehículo" });
  }
};

export const updateVehiculo = async (req, res) => {
  try {
    const { error, value } = vehiculoBodySchema.validate(req.body, { abortEarly: false, allowUnknown: true });
    if (error) {
      return res.status(400).json({ mensaje: "Error de validación", errores: error.details.map(e => e.message) });
    }

    value.vencimiento_permiso = req.body.vencimiento_permiso ? req.body.vencimiento_permiso : null;
    value.vencimiento_revision = req.body.vencimiento_revision ? req.body.vencimiento_revision : null;

    if (req.files?.permiso_circulacion) {
      value.permiso_circulacion = req.files.permiso_circulacion[0].filename;
    } else if (req.body.quitar_permiso === 'true') {
      value.permiso_circulacion = null;
    }

    if (req.files?.revision_tecnica) {
      value.revision_tecnica = req.files.revision_tecnica[0].filename;
    } else if (req.body.quitar_revision === 'true') {
      value.revision_tecnica = null;
    }

    delete value.quitar_permiso;
    delete value.quitar_revision;

    await vehiculoService.updateVehiculoService(req.params.id, value);
    res.status(200).json({ mensaje: "Vehículo actualizado con éxito" });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    console.error("Error al actualizar vehículo:", error);
    res.status(500).json({ mensaje: "Error interno al actualizar" });
  }
};

export const deleteVehiculo = async (req, res) => {
  try {
    await vehiculoService.deleteVehiculoService(req.params.id);
    res.status(200).json({ mensaje: "Vehículo eliminado con éxito" });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ mensaje: error.message });
    console.error("Error al eliminar vehículo:", error);
    res.status(500).json({ mensaje: "Error interno al eliminar" });
  }
};