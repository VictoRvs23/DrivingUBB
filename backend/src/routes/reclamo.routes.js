"use strict";
import { Router } from "express";
import { 
    createReclamo, getMisReclamos, getAllReclamos, responderReclamo, deleteReclamo 
} from "../controllers/reclamo.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { reclamoValidation, respuestaValidation } from "../validations/soporte.validation.js";

const router = Router();

router.post("/", verifyToken, validateBody(reclamoValidation), createReclamo);
router.get("/mis-reclamos", verifyToken, getMisReclamos);

router.get("/admin/todos", verifyToken, isAdmin, getAllReclamos);
router.patch("/admin/responder/:id", verifyToken, isAdmin, validateBody(respuestaValidation), responderReclamo);
router.delete("/:id", verifyToken, isAdmin, deleteReclamo);

export default router;