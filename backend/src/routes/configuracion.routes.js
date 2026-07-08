"use strict";
import { Router } from "express";
import { changePassword, toggleEmails } from "../controllers/configuracion.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyToken);
router.put("/cambiar-password", changePassword);
router.put("/correos", toggleEmails);

export default router;