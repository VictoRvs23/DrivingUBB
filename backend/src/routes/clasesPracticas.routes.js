import { Router } from "express";
import * as controller from "../controllers/clasesPracticas.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validateBody.js";
import * as schema from "../validations/clasesPracticas.validation.js";

const router = Router();

router.use(authenticateToken);

router.get("/alumno", authorizeRoles("user"), controller.getClasesAlumno);
router.post("/reservar", authorizeRoles("user"), validateBody(schema.crearClaseSchema), controller.reservarClaseAlumno);

router.get("/instructor", authorizeRoles("instructor"), controller.getClasesInstructor);
router.put("/calificar/:id", authorizeRoles("instructor"), validateBody(schema.calificarClaseSchema), controller.calificarClase);

router.put("/asignar/:id", authorizeRoles("secretaria", "admin"), validateBody(schema.asignarRecursosSchema), controller.asignarRecursosAClase);

export default router;