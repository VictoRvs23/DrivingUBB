"use strict";
import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import claseteorica from "./claseteorica.routes.js";
const router = Router();

router.use("/users", userRoutes); 
router.use("/auth", authRoutes);  
router.use("/claseteorica", claseteorica);  

export default router;