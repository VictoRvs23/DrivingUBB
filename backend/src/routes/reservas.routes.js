"use strict";
import { Router } from "express";
import { createReserva, getReservasByFecha } from "../controllers/reservas.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/", getReservasByFecha);
router.post("/", createReserva);

export default router;