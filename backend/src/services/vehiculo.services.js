import { AppDataSource } from "../config/configDb.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";

const vehiculoRepository = AppDataSource.getRepository(Vehiculo);

const documentoVigente = (archivo, fecha) => {
    if (!archivo || !fecha) return false;
    const hoy = new Date();
    const fechaVencimiento = fecha instanceof Date ? fecha : new Date(fecha);
    return fechaVencimiento.getTime() >= hoy.getTime();
};

const esVehiculoDisponible = (vehiculo) => {
    const permisoOk = documentoVigente(vehiculo.permiso_circulacion, vehiculo.vencimiento_permiso);
    const revisionOk = documentoVigente(vehiculo.revision_tecnica, vehiculo.vencimiento_revision);
    return permisoOk && revisionOk;
};

export const getVehiculosService = async () => {
    const vehiculos = await vehiculoRepository.find();
    return vehiculos.map(v => ({
        ...v,
        estadoCalculado: esVehiculoDisponible(v) ? v.estado : "No Disponible"
    }));
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