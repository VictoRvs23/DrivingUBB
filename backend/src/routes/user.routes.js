"use strict";
import { Router } from "express";
import { preRegister, approveUser, getPendingUsers, rejectUser} from "../controllers/user.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/pre-register", preRegister);

router.get("/pending", getPendingUsers);

router.patch("/approve/:id", verifyToken, isAdmin, approveUser); 

router.delete("/reject/:id", verifyToken, isAdmin, rejectUser);

export default router;