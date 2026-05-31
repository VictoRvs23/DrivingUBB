import {Router} from "express";
import {obtenerPreguntas, crearPregunta, eliminarPregunta} from "../controllers/pregunta.controller.js";

const preguntaRoutes=Router();

//get- obtener preguntas
preguntaRoutes.get("/",obtenerPreguntas);

//post- crear pregunta
preguntaRoutes.post("/",crearPregunta);

//delete- eliminar pregunta
preguntaRoutes.delete("/:id",eliminarPregunta);

export default preguntaRoutes;