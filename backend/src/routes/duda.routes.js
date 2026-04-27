"use strict";
import { Router } from "express";
import { createDuda, getMisDudas, getAllDudas, responderDuda, deleteDuda } from "../controllers/duda.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { dudaValidation, respuestaValidation } from "../validations/soporte.validation.js";

const router = Router();

// Rutas para Alumnos
router.post("/", verifyToken, validateBody(dudaValidation), createDuda);
router.get("/mis-dudas", verifyToken, getMisDudas);

// Rutas para Admin / Secretaria
router.get("/admin/todas", verifyToken, isAdmin, getAllDudas);
router.patch("/admin/responder/:id", verifyToken, isAdmin, validateBody(respuestaValidation), responderDuda);
router.delete("/:id", verifyToken, isAdmin, deleteDuda);

export default router;