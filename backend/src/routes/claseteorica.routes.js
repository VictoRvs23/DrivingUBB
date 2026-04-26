import { Router } from "express";
import {
    getclasesteoricas,
    getclaseteoricaporid,
    crearclase,
    actualizarclase,
    eliminarclase,
    verificarclase
}from "../controllers/claseteorica.controller.js";
const router = Router();

router.get("/",getclasesteoricas); //todas las clases teoricas
router.get("/:id",getclaseteoricaporid); //buscar una clase por id
router.post("/",crearclase); //post para crear la clase
router.put("/:id",actualizarclase); //put para actualizar la clase
router.delete("/:id",eliminarclase); //delete para eliminar la clase
router.get("/:id/status",verificarclase); //verificar si se puede unir a la clase

export default router;