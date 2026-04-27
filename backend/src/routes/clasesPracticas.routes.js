import { Router } from "express";
import * as controller from "../controllers/clasesPracticas.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/alumno", authorizeRoles("alumno"), controller.getClasesAlumno);
router.get("/instructor", authorizeRoles("instructor"), controller.getClasesInstructor);
router.put("/calificar/:id", authorizeRoles("instructor"), controller.calificarClase);

export default router;