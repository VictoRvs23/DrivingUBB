"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import dudaRoutes from "./duda.routes.js";
import errorRoutes from "./error.routes.js";
import reclamoRoutes from "./reclamo.routes.js";
import sugerenciaRoutes from "./sugerencia.routes.js";
import archivoRoutes from "./archivo.routes.js";

const router = Router();

router.use("/users", userRoutes); 
router.use("/auth", authRoutes);
router.use("/dudas", dudaRoutes);
router.use("/errores", errorRoutes);
router.use("/reclamos", reclamoRoutes);
router.use("/sugerencias", sugerenciaRoutes);
router.use("/archivo", archivoRoutes);  

export default router;