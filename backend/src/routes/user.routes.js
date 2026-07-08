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
import { upload, handleFileSizeLimit } from "../middleware/uploadArchive.middleware.js";

const router = Router();

router.post("/pre-register", upload.single("boleta"), handleFileSizeLimit, preRegister);

router.get("/pending", verifyToken, isAdmin, getPendingUsers);
router.patch("/approve/:id", verifyToken, isAdmin, approveUser); 
router.delete("/reject/:id", verifyToken, isAdmin, rejectUser);

const accesosPermitidos = authorizeRoles("admin", "secretaria");

const canEditProfile = (req, res, next) => {
    const idFromUrl = req.params.id;
    const userRole = req.user.role;
    const idFromToken = req.user.id;

    if (userRole === "admin" || userRole === "secretaria" || String(idFromToken) === String(idFromUrl)) {
        return next();
    }
    return res.status(403).json({ message: "No tienes permiso para editar este perfil." });
};

router.get("/", verifyToken, accesosPermitidos, getUsers);
router.post("/", verifyToken, accesosPermitidos, createUser);
router.put("/:id", verifyToken, canEditProfile, updateUser);
router.delete("/:id", verifyToken, accesosPermitidos, deleteUser);

export default router;