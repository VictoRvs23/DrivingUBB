"use strict";
import * as authService from "../services/auth.services.js";

export async function login(req, res) {
  try {
    const { token, user } = await authService.loginService(req.body);
    res.status(200).json({ message: "Inicio de sesión exitoso", token, user });
  } catch (error) {
    if (error.status) return res.status(error.status).json({ message: error.message });
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
}