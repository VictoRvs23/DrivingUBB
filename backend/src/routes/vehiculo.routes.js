import { Router } from "express";
import * as controller from "../controllers/vehiculo.controller.js";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.js";
import { upload, handleFileSizeLimit } from "../middleware/uploadArchive.middleware.js"; 

const router = Router();

router.use(verifyToken);

router.get("/", authorizeRoles("secretaria", "admin"), controller.getVehiculos);

const uploadArchivos = upload.fields([
  { name: 'permiso_circulacion', maxCount: 1 },
  { name: 'revision_tecnica', maxCount: 1 }
]);

router.post("/", 
  authorizeRoles("secretaria", "admin"), 
  uploadArchivos, 
  handleFileSizeLimit, 
  controller.createVehiculo
);

router.put("/:id", 
  authorizeRoles("secretaria", "admin"), 
  uploadArchivos,
  handleFileSizeLimit,
  controller.updateVehiculo
);

router.delete("/:id", authorizeRoles("secretaria", "admin"), controller.deleteVehiculo);

export default router;