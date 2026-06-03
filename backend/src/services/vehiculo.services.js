import { AppDataSource } from "../config/configDb.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";

const vehiculoRepository = AppDataSource.getRepository(Vehiculo);

export const getVehiculosService = async () => {
    return await vehiculoRepository.find();
};

export const createVehiculoService = async (data) => {
    const nuevoVehiculo = vehiculoRepository.create(data);
    return await vehiculoRepository.save(nuevoVehiculo);
};

export const updateVehiculoService = async (id, data) => {
    const vehiculoExistente = await vehiculoRepository.findOneBy({ id: parseInt(id) });
    if (!vehiculoExistente) {
        throw { status: 404, message: "Vehículo no encontrado. No se pudo actualizar." };
    }
    await vehiculoRepository.update(id, data);
    return true;
};

export const deleteVehiculoService = async (id) => {
    const vehiculoExistente = await vehiculoRepository.findOneBy({ id: parseInt(id) });
    if (!vehiculoExistente) {
        throw { status: 404, message: "Vehículo no encontrado. No se pudo eliminar." };
    }
    await vehiculoRepository.delete(id);
    return true;
};