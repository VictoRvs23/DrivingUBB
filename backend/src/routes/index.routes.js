"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import clasesPracticasRoutes from "./clasesPracticas.routes.js"; 
import vehiculosRoutes from "./vehiculo.routes.js";
import reservasRoutes from "./reservas.routes.js";

const router = Router();

router.use("/users", userRoutes); 
router.use("/auth", authRoutes);  
router.use("/clases-practicas", clasesPracticasRoutes); 
router.use("/vehiculos", vehiculosRoutes);
router.use("/reservas", reservasRoutes);

export default router;