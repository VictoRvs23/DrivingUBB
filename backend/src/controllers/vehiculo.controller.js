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
    const { error, value } = vehiculoBodySchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ mensaje: "Error de validación", errores: error.details.map(e => e.message) });
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
    const { error, value } = vehiculoBodySchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ mensaje: "Error de validación", errores: error.details.map(e => e.message) });
    }
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