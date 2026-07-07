import { Router } from "express";
import * as controller from "../controllers/clasesPracticas.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validateBody.js";
import { asignarRecursosSchema } from "../validations/clasesPracticas.validation.js";

const router = Router();

router.use(verifyToken);

router.get("/", authorizeRoles("alumno"), controller.getClasesAlumno);
router.get("/instructor", authorizeRoles("instructor"), controller.getClasesInstructor);
router.put("/calificar/:id", authorizeRoles("instructor"), controller.calificarClase);

router.get("/asignaciones", authorizeRoles("secretaria", "admin"), controller.getClasesParaAsignacion);
router.patch("/asignar/:id", authorizeRoles("secretaria", "admin"), validateBody(asignarRecursosSchema), controller.asignarInstructorYVehiculo);

export default router;