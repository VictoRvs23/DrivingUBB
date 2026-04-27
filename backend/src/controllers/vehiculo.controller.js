import { AppDataSource } from "../config/configDb.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";

const vehiculoRepository = AppDataSource.getRepository(Vehiculo);

export const getVehiculos = async (req, res) => {
  try {
    const vehiculos = await vehiculoRepository.find();
    res.json(vehiculos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener vehículos" });
  }
};

export const createVehiculo = async (req, res) => {
  try {
    const nuevoVehiculo = vehiculoRepository.create(req.body);
    await vehiculoRepository.save(nuevoVehiculo);
    res.status(201).json(nuevoVehiculo);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el vehículo" });
  }
};

export const updateVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    await vehiculoRepository.update(id, req.body);
    res.json({ mensaje: "Vehículo actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar" });
  }
};

export const deleteVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    await vehiculoRepository.delete(id);
    res.json({ mensaje: "Vehículo eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar" });
  }
};