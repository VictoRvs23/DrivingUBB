 "use strict";
import { Router } from "express";
import { getFAQs, createFAQ, deleteFAQ, updateFAQ } from "../controllers/preguntaFrecuente.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { preguntaFrecuenteSchema, updatePreguntaFrecuenteSchema } from "../validations/preguntaFrecuente.validation.js";

const router = Router();

router.use(verifyToken);
router.get("/", getFAQs);
router.post("/", authorizeRoles("secretaria", "admin"), validateBody(preguntaFrecuenteSchema), createFAQ);
router.patch("/:id", authorizeRoles("secretaria", "admin"), validateBody(updatePreguntaFrecuenteSchema), updateFAQ);
router.delete("/:id", authorizeRoles("secretaria", "admin"), deleteFAQ);

export default router;
