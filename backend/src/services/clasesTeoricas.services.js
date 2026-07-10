import { AppDataSource } from "../config/configDb.js";
import { ClaseTeorica } from "../entities/clasesTeoricas.entity.js";

const claseTeoricaRepository = AppDataSource.getRepository(ClaseTeorica);

export const getClasesTeoricasService = async () => {
  return await claseTeoricaRepository.find({
    relations: ["profesor"],
    order: { fecha_hora: "ASC" },
  });
};

export const getClasesTeoricasInstructorService = async (profesorId) => {
  return await claseTeoricaRepository.find({
    where: { profesor: { id: profesorId } },
    relations: ["profesor"],
    order: { fecha_hora: "ASC" },
  });
};

export const createClaseTeoricaService = async (data) => {
  const nuevaClase = claseTeoricaRepository.create(data);
  return await claseTeoricaRepository.save(nuevaClase);
};

export const updateClaseTeoricaService = async (id, profesorId, data) => {
  const clase = await claseTeoricaRepository.findOne({
    where: { id_clase: parseInt(id) },
    relations: ["profesor"],
  });

  if (!clase) {
    throw { status: 404, message: "Clase teórica no encontrada." };
  }
  if (clase.profesor.id !== profesorId) {
    throw { status: 403, message: "No puedes editar una clase teórica que no te pertenece." };
  }

  await claseTeoricaRepository.update(id, data);
  return true;
};

export const deleteClaseTeoricaService = async (id, profesorId) => {
  const clase = await claseTeoricaRepository.findOne({
    where: { id_clase: parseInt(id) },
    relations: ["profesor"],
  });

  if (!clase) {
    throw { status: 404, message: "Clase teórica no encontrada." };
  }
  if (clase.profesor.id !== profesorId) {
    throw { status: 403, message: "No puedes eliminar una clase teórica que no te pertenece." };
  }

  await claseTeoricaRepository.remove(clase);
  return true;
};