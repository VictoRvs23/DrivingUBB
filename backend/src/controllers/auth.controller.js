"use strict";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/configEnv.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.isApproved === false) {
      return res.status(403).json({ 
        message: "Tu solicitud de ingreso aún no ha sido aprobada" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: "1d" } 
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: { 
        nombre: user.nombre, 
        role: user.role,
        email: user.email 
      }
    });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
}