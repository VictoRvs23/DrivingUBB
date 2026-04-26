"use strict";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

export async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    const count = await userRepository.count();
    if (count > 0) {
      console.log("=> Usuarios ya existentes en la base de datos.");
      return;
    }

    // Usuarios de prueba 
    const users = [
      {
        nombre: "Admin Escuela",
        email: "admin@escuela.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        isApproved: true,
        numeroTelefonico: "900000001",
      },
      {
        nombre: "Secretaria",
        email: "secretaria@escuela.com",
        password: await bcrypt.hash("secre123", 10),
        role: "secretaria",
        isApproved: true,
        numeroTelefonico: "900000002",
      },
      {
        nombre: "Instructor",
        email: "instructor@escuela.com",
        password: await bcrypt.hash("inst123", 10),
        role: "instructor",
        isApproved: true,
        numeroTelefonico: "900000003",
      },
      {
        nombre: "Alumno",
        email: "alumno@gmail.com",
        password: await bcrypt.hash("alumno123", 10),
        role: "alumno",
        isApproved: false,
        numeroTelefonico: "900000004",
      }
    ];

    console.log("=> Creando usuarios iniciales para la Escuela de Manejo...");
    
    for (const u of users) {
      const nuevoUsuario = userRepository.create(u);
      await userRepository.save(nuevoUsuario);
      console.log(`Usuario '${u.nombre}' con rol '${u.role}' creado con éxito.`);
    }

  } catch (error) {
    console.error("=> Error al inicializar los usuarios:", error);
    throw error;
  }
}