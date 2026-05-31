"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import soporteRoutes from "./soporte.routes.js";
import archivoRoutes from "./archivo.routes.js";

const router = Router();

router.use("/users", userRoutes); 
router.use("/auth", authRoutes);
router.use("/soporte", soporteRoutes);
router.use("/archivo", archivoRoutes);  

export default router;