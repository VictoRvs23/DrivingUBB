import {Router}from "express";
import{
    obtenerPreguntas,
    generarExamenAleatorio,
    guardarRespuestas,
    finalizarExamen,
    obtenerExamenPorId,
    obtenerResultado
}from "../controllers/examenteorico.controller.js";

const examenTeoricoRoutes=Router();

//get- obtener preguntas para admin
examenTeoricoRoutes.get("/preguntas",obtenerPreguntas);

//post- generar examen aleatorio para estudiante
examenTeoricoRoutes.post("/",generarExamenAleatorio);

//put generar examen aleatorio
examenTeoricoRoutes.put("/:id/respuestas",guardarRespuestas);

//put finalizar examen
examenTeoricoRoutes.put("/:id/finalizar",finalizarExamen);

//get- obtener examen por id
examenTeoricoRoutes.get("/:id",obtenerExamenPorId);

//get- obtener resultado del examen
examenTeoricoRoutes.get("/:id/resultado",obtenerResultado);

export default examenTeoricoRoutes;