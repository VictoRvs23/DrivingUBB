import { Router } from "express";
import * as controller from "../controllers/vehiculo.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";
import { vehiculoBodySchema } from "../validations/vehiculo.validation.js";
import { validateBody } from "../middleware/validateBody.js";

const router = Router();

router.use(verifyToken);

router.get("/", 
  authorizeRoles("secretaria", "admin"), 
  controller.getVehiculos
);

router.post("/", 
  authorizeRoles("secretaria", "admin"), 
  validateBody(vehiculoBodySchema),
  controller.createVehiculo
);

router.put("/:id", 
  authorizeRoles("secretaria", "admin"), 
  validateBody(vehiculoBodySchema),
  controller.updateVehiculo
);

router.delete("/:id", 
  authorizeRoles("secretaria", "admin"), 
  controller.deleteVehiculo
);

export default router;