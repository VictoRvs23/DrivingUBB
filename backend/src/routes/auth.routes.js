"use strict";
import { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { loginValidation } from "../validations/user.validation.js"; 
import { validateBody } from "../middleware/validateBody.js";

const router = Router();

router.post("/login", validateBody(loginValidation), login);

export default router;