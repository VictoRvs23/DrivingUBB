import{Router} from "express";
import {
    obtenerEvaluaciones,
    obtenerEvaluacionesPorEstudiante,
    obtenerEvaluacionPorId,
    crearEvaluacion,
    registrarFalta,
    finalizarEvaluacion,
    actualizarEvaluacion,
    eliminarEvaluacion
}from "../controllers/evaluacionpractica.controller.js";
const router = Router();

//get- obtener todas las evaluaciones
router.get("/",obtenerEvaluaciones);
//get- obtener historial de evaluaciones de un estudiante (debe ir antes de "/:id")
router.get("/estudiante/:id_estudiante",obtenerEvaluacionesPorEstudiante);
//get- obtener evaluacion por id
router.get("/:id",obtenerEvaluacionPorId);
//post- crear nueva evaluacion
router.post("/",crearEvaluacion);
//post- registrar falta en evaluacion
router.post("/:id/falta",registrarFalta);
//post- finalizar evaluacion y calcular puntaje
router.put("/:id/finalizar",finalizarEvaluacion);   
//put- actualizar evaluacion (observaciones, estado, puntaje_obtenido)
router.put("/:id",actualizarEvaluacion);
//delete- eliminar evaluacion
router.delete("/:id",eliminarEvaluacion);

export default router;