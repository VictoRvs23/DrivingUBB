"use strict";
import { Router } from "express";
import { 
    createSoporte, getMisSoportes, getAllSoportes, responderSoporte, deleteSoporte 
} from "../controllers/soporte.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { soporteValidation, respuestaValidation } from "../validations/soporte.validation.js";
import { uploadImage, handleImageSizeLimit } from "../middleware/uploadImage.middleware.js";

const router = Router();

// --- Rutas de Alumnos ---
router.post("/", verifyToken, uploadImage.single("imagen_adjunta"), handleImageSizeLimit, validateBody(soporteValidation), createSoporte);
router.get("/mis-soportes", verifyToken, getMisSoportes);

// --- Rutas de Admin ---
router.get("/admin/todos", verifyToken, isAdmin, getAllSoportes);
router.patch("/admin/responder/:id", verifyToken, isAdmin, validateBody(respuestaValidation), responderSoporte);
router.delete("/:id", verifyToken, isAdmin, deleteSoporte);

export default router;