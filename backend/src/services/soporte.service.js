"use strict";
import { AppDataSource } from "../config/configDb.js";
import { Soporte } from "../entities/soporte.entity.js";

export const createSoporteService = async (data, userId, imageUrl) => {
    try {
        const soporteRepo = AppDataSource.getRepository(Soporte);
        const nuevoSoporte = soporteRepo.create({
            ...data,
            imagen_adjunta: imageUrl,
            usuario: { id: userId }
        });
        await soporteRepo.save(nuevoSoporte);
        return [nuevoSoporte, null];
    } catch (error) {
        return [null, "Error al crear el ticket de soporte: " + error.message];
    }
};

export const getMisSoportesService = async (userId, tipo) => {
    try {
        const soporteRepo = AppDataSource.getRepository(Soporte);
        
        // Creamos la condición base (siempre filtra por el usuario logueado)
        const whereClause = { usuario: { id: userId } };
        
        // Si nos pasan un tipo válido, lo agregamos al filtro
        if (tipo) {
            whereClause.tipo = tipo;
        }

        const soportes = await soporteRepo.find({
            where: whereClause,
            order: { created_at: "DESC" }
        });
        return [soportes, null];
    } catch (error) {
        return [null, "Error al obtener tus soportes"];
    }
};

export const getAllSoportesService = async (tipo) => {
    try {
        const soporteRepo = AppDataSource.getRepository(Soporte);
        
        // Filtro vacío por defecto (trae todos)
        const whereClause = {};
        
        // Si nos pasan el tipo, filtramos por eso
        if (tipo) {
            whereClause.tipo = tipo;
        }

        const soportes = await soporteRepo.find({
            where: whereClause,
            relations: ["usuario"],
            order: { created_at: "DESC" },
            select: { usuario: { id: true, nombre: true, email: true } }
        });
        return [soportes, null];
    } catch (error) {
        return [null, "Error al obtener todos los soportes"];
    }
};;

export const responderSoporteService = async (id, respuesta_admin) => {
    try {
        const soporteRepo = AppDataSource.getRepository(Soporte);
        const soporte = await soporteRepo.findOneBy({ id: parseInt(id) });
        
        if (!soporte) return [null, "Soporte no encontrado"];
        if (soporte.estado === "eliminado") return [null, "No puedes responder a un soporte eliminado"];

        soporte.respuesta_admin = respuesta_admin;
        soporte.estado = "respondido"; // Cambiamos el estado

        await soporteRepo.save(soporte);
        return [soporte, null];
    } catch (error) {
        return [null, "Error al responder el soporte"];
    }
};

export const eliminarSoporteService = async (id) => {
    try {
        const soporteRepo = AppDataSource.getRepository(Soporte);
        const soporte = await soporteRepo.findOneBy({ id: parseInt(id) });
        
        if (!soporte) return [null, "Soporte no encontrado"];

        // Soft Delete: No lo borramos, solo le cambiamos el estado
        soporte.estado = "eliminado";
        await soporteRepo.save(soporte);

        return [soporte, null];
    } catch (error) {
        return [null, "Error al eliminar el soporte"];
    }
};