"use strict";
import { loginService } from "../services/auth.services.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await loginService(email, password);
    
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      ...result
    });
  } catch (error) {
    console.error("Error en el login:", error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Error en el servidor" });
  }
}