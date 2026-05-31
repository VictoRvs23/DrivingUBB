"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import claseteorica from "./claseteorica.routes.js";
import evaluacionpractica from "./evaluacionpractica.routes.js";
import examenTeoricoRoutes from "./examenteorico.routes.js";
import preguntaRoutes from "./pregunta.routes.js";
const router = Router();

router.use("/users", userRoutes); 
router.use("/auth", authRoutes);  
router.use("/claseteorica", claseteorica);  
router.use("/evaluacionpractica", evaluacionpractica);  
router.use("/examenteorico", examenTeoricoRoutes);  
router.use("/preguntas", preguntaRoutes);

export default router;
