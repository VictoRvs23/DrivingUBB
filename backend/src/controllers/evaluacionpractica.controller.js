import { AppDataSource } from "../config/configDb.js";
import { EvaluacionPractica } from "../entities/evaluacionpractica.entity.js";

//obtener las evaluaciones
export async function  obtenerEvaluaciones(req, res) {
    try {
        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const evaluaciones=await evaluacionRepository.find();
        res.status(200).json(evaluaciones);
    }catch (error){
        res.status(500).json({message:"Error al obtener las evaluaciones"});
    }
}

//obetener evaluacion por id
export async function obtenerEvaluacionPorId(req, res) {
    try {
        const { id } = req.params;
        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const evaluacion = await evaluacionRepository.findOneBy({ id_evaluacion: parseInt(id) });
        if(!evaluacion){
            return res.status(404).json({message:"Evaluacion no encontrada"});
        }

        res.status(200).json(evaluacion);
    }catch (error){
        res.status(500).json({message:"Error al obtener la evaluacion"});
    }
}
//crear evaluacion nueva
export async function crearEvaluacion(req, res) {
    try {
        const {id_estudiante, id_instructor,fecha_evaluacion}=req.body;

        if(!id_estudiante || !id_instructor || !fecha_evaluacion){
            return res.status(400).json({message:"Faltan campos por completar"});
        }

        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const nuevaEvaluacion=evaluacionRepository.create({
            id_estudiante,
            id_instructor,
            fecha_evaluacion,
            estado:"en_progreso",
            falta_critica:false,
            faltas:[]
        });

        await evaluacionRepository.save(nuevaEvaluacion);
        res.status(201).json(nuevaEvaluacion);
    }catch (error){
        res.status(500).json({message:"Error al crear la evaluacion"});
    }
}

//registrar falta en evaluacion
export async function registrarFalta(req, res) {
    try {
        const { id } = req.params;
        const { nombre_falta, es_critica } = req.body;

        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const evaluacion = await evaluacionRepository.findOneBy({ id_evaluacion: parseInt(id) });

        if (!evaluacion) {
            return res.status(404).json({ message: "Evaluación no encontrada" });
        }

        //si la falta es critica se reprueba automaticamente
        if(es_critica){
            evaluacion.falta_critica=true;
            evaluacion.estado="reprobado";
            evaluacion.puntaje_obtenido=0;
        }

        //agregar falta al arreglo
        if(!evaluacion.faltas) evaluacion.faltas=[];
        evaluacion.faltas.push({nombre_falta, es_critica,fecha:new Date()});
        await evaluacionRepository.save(evaluacion);
        res.status(200).json(evaluacion);
    }catch (error){
        res.status(500).json({message:"Error al registrar la falta"});
    }
}

//finalizar evaluacion y obtener el resultado
export async function finalizarEvaluacion(req, res) {
    try {
        const { id } = req.params;
        const { puntaje_obtenido, observaciones } = req.body;

        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const evaluacion = await evaluacionRepository.findOneBy({ id_evaluacion: parseInt(id) });

        if(!evaluacion){
            return res.status(404).json({message:"Evaluacion no encontrada"});
        }

        evaluacion.puntaje_obtenido = puntaje_obtenido;
        evaluacion.estado = puntaje_obtenido >= 60 ? "aprobado" : "reprobado";

        evaluacion.observaciones=observaciones;
        await evaluacionRepository.save(evaluacion);
        res.status(200).json(evaluacion);
    }catch(error){
        res.status(500).json({message:"Error al finalizar la evaluacion"});
    }
}

//actualizar evaluacion
export async function actualizarEvaluacion(req, res) {
    try{
        const{id}=req.params;
        const{observaciones,puntaje_obtenido}=req.body;

        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const evaluacion = await evaluacionRepository.findOneBy({ id_evaluacion: parseInt(id) });

        if(!evaluacion){
            return res.status(404).json({message:"Evaluacion no encontrada"});
        }

        if(observaciones) evaluacion.observaciones=observaciones;
        if(puntaje_obtenido!==undefined) evaluacion.puntaje_obtenido=puntaje_obtenido;

        await evaluacionRepository.save(evaluacion);
        res.status(200).json(evaluacion);
    }catch(error){
        res.status(500).json({message:"Error al actualizar la evaluacion"});
    }
}

//eliminar evaluacion
export async function eliminarEvaluacion(req, res) {
    try{
        const {id}=req.params;
        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const evaluacion = await evaluacionRepository.findOneBy({ id_evaluacion: parseInt(id) });

        if(!evaluacion){
            return res.status(404).json({message:"Evaluacion no encontrada"});
        }

        await evaluacionRepository.remove(evaluacion);
        res.status(200).json({message:"Evaluacion eliminada sin problemas"});
    }catch(error){
        res.status(500).json({message:"Error al eliminar la evaluacion"});
    }
}