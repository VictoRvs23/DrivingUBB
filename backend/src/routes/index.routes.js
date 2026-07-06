"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import claseteorica from "./claseteorica.routes.js";
import evaluacionpractica from "./evaluacionpractica.routes.js";
import examenTeoricoRoutes from "./examenteorico.routes.js";
import preguntaRoutes from "./pregunta.routes.js";
import soporteRoutes from "./soporte.routes.js";
import archivoRoutes from "./archivo.routes.js";
import clasesPracticasRoutes from "./clasesPracticas.routes.js";
import vehiculosRoutes from "./vehiculo.routes.js";
import reservasRoutes from "./reservas.routes.js";
import faqRoutes from "./preguntaFrecuente.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/claseteorica", claseteorica);
router.use("/evaluacionpractica", evaluacionpractica);
router.use("/examenteorico", examenTeoricoRoutes);
router.use("/preguntas", preguntaRoutes);
router.use("/soporte", soporteRoutes);
router.use("/archivo", archivoRoutes);
router.use("/clases-practicas", clasesPracticasRoutes);
router.use("/vehiculos", vehiculosRoutes);
router.use("/reservas", reservasRoutes);
router.use("/faqs", faqRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
