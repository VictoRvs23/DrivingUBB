"use strict";
import { Router } from "express";
import { 
    preRegister, 
    approveUser, 
    getPendingUsers, 
    rejectUser,
    getUsers,       
    createUser,     
    updateUser,   
    deleteUser     
} from "../controllers/user.controller.js";
import { verifyToken, isAdmin, authorizeRoles } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/pre-register", preRegister);
router.get("/pending", verifyToken, isAdmin, getPendingUsers);
router.patch("/approve/:id", verifyToken, isAdmin, approveUser); 
router.delete("/reject/:id", verifyToken, isAdmin, rejectUser);

const accesosPermitidos = authorizeRoles("admin", "secretaria");

router.get("/", verifyToken, accesosPermitidos, getUsers);
router.post("/", verifyToken, accesosPermitidos, createUser);
router.put("/:id", verifyToken, accesosPermitidos, updateUser);
router.delete("/:id", verifyToken, accesosPermitidos, deleteUser);

export default router;