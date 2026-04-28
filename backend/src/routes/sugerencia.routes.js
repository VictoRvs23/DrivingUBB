"use strict";
import { Router } from "express";
import { 
    createSugerencia, getMisSugerencias, getAllSugerencias, deleteSugerencia 
} from "../controllers/sugerencia.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { sugerenciaValidation } from "../validations/soporte.validation.js";
import { uploadImage, handleImageSizeLimit } from "../middleware/uploadImage.middleware.js";

const router = Router();

router.post("/", verifyToken, uploadImage.single("adjunto_idea"), handleImageSizeLimit, validateBody(sugerenciaValidation), createSugerencia);
router.get("/mis-sugerencias", verifyToken, getMisSugerencias);

router.get("/admin/todas", verifyToken, isAdmin, getAllSugerencias);
router.delete("/:id", verifyToken, isAdmin, deleteSugerencia);

export default router;