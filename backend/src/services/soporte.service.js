"use strict";
import { AppDataSource } from "../config/configDb.js";
import { Soporte } from "../entities/soporte.entity.js";
import { LessThan } from "typeorm"; 
import { sendSoporteRespondidoEmail, sendSoporteEliminadoEmail } from "./mail.services.js";

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
        const whereClause = { usuario: { id: userId } };
        
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
        const whereClause = {};
        
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
        const soporte = await soporteRepo.findOne({
            where: { id: parseInt(id) },
            relations: ["usuario"]
        });
        
        if (!soporte) return [null, "Soporte no encontrado"];
        if (soporte.estado === "eliminado") return [null, "No puedes responder a un soporte eliminado"];
        soporte.respuesta_admin = respuesta_admin;
        soporte.estado = "respondido"; 
        
        await soporteRepo.save(soporte);
        
        if (soporte.usuario) {
            sendSoporteRespondidoEmail(soporte.usuario.email, soporte.usuario.nombre, soporte.titulo, respuesta_admin);
        }
        return [soporte, null];
    } catch (error) {
        return [null, "Error al responder el soporte"];
    }
};

export const eliminarSoporteService = async (id) => {
    try {
        const soporteRepo = AppDataSource.getRepository(Soporte);
        const soporte = await soporteRepo.findOne({
            where: { id: parseInt(id) },
            relations: ["usuario"]
        });
        
        if (!soporte) return [null, "Soporte no encontrado"];
        soporte.estado = "eliminado";
        await soporteRepo.save(soporte);

        if (soporte.usuario) {
            sendSoporteEliminadoEmail(soporte.usuario.email, soporte.usuario.nombre, soporte.titulo);
        }
        return [soporte, null];
    } catch (error) {
        return [null, "Error al eliminar el soporte"];
    }
};

export const purgarSoportesAntiguos = async () => {
    try {
        const soporteRepo = AppDataSource.getRepository(Soporte);
        const hace24Horas = new Date();
        hace24Horas.setHours(hace24Horas.getHours() - 24);

        const result = await soporteRepo.delete({
            estado: "eliminado",
            updated_at: LessThan(hace24Horas)
        });

        if (result.affected > 0) {
            console.log(`=> Mantenimiento: Se borraron definitivamente ${result.affected} tickets de soporte antiguos.`);
        }
    } catch (error) {
        console.error("Error en la purga automática de soportes:", error);
    }
};