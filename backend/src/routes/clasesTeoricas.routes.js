import { Router } from "express";
import * as controller from "../controllers/clasesTeoricas.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/", authorizeRoles("alumno", "instructor", "admin"), controller.getClasesTeoricas);

router.get("/mis-clases", authorizeRoles("instructor", "admin"), controller.getMisClasesTeoricas);

router.post("/", authorizeRoles("instructor", "admin"), controller.createClaseTeorica);
router.put("/:id", authorizeRoles("instructor", "admin"), controller.updateClaseTeorica);
router.delete("/:id", authorizeRoles("instructor", "admin"), controller.deleteClaseTeorica);

export default router;