"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import clasesPracticasRoutes from "./clasesPracticas.routes.js"; 

const router = Router();

router.use("/users", userRoutes); 
router.use("/auth", authRoutes);  
router.use("/clases-practicas", clasesPracticasRoutes); 

export default router;