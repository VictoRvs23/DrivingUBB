import { Router } from "express";
import { getDashboardAlumno } from "../controllers/dashboardAlumno.controller.js";
import { getDashboardInstructor } from "../controllers/dashboardInstructor.controller.js";
import { getDashboardAdmin } from "../controllers/dashboardSecreAdmin.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/mi-resumen", verifyToken, authorizeRoles("alumno", "admin"), getDashboardAlumno);

router.get("/instructor-resumen", verifyToken, authorizeRoles("instructor", "admin"), getDashboardInstructor);

router.get("/admin-resumen", verifyToken, authorizeRoles("admin", "secretaria"), getDashboardAdmin);

export default router;