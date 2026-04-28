"use strict";

import Archivo from "../entities/archivo.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function subidaArchivoService(archivoData) {
  try {
    const archivoRepository = AppDataSource.getRepository(Archivo);
    const { nombre, archivoPath } = archivoData;
    console.log("Datos recibidos para guardar en la base de datos:", { nombre, archivoPath });

    const newArchivo = archivoRepository.create({
      nombre,
      archivo: archivoPath, 
    });
    await archivoRepository.save(newArchivo);
    return [newArchivo, null];
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getArchivosService() {
  try {
    const archivoRepository = AppDataSource.getRepository(Archivo);

    const archivos = await archivoRepository.find();
    return [archivos, null];
  } catch (error) {
    console.error("Error al obtener archivos:", error);
    return [null, "Error interno del servidor"];
  }
}