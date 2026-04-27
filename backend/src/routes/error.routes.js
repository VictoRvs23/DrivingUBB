"use strict";
import { Router } from "express";
import { 
    createError, getMisErrores, getAllErrores, responderError, deleteError 
} from "../controllers/error.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { errorValidation, respuestaValidation } from "../validations/soporte.validation.js";

const router = Router();

router.post("/", verifyToken, validateBody(errorValidation), createError);
router.get("/mis-errores", verifyToken, getMisErrores);

router.get("/admin/todos", verifyToken, isAdmin, getAllErrores);
router.patch("/admin/responder/:id", verifyToken, isAdmin, validateBody(respuestaValidation), responderError);
router.delete("/:id", verifyToken, isAdmin, deleteError);

export default router;