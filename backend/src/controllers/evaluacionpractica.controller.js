import { AppDataSource } from "../config/configDb.js";
import { EvaluacionPractica } from "../entities/evaluacionpractica.entity.js";
import { ClasePractica } from "../entities/clasespracticas.entity.js";

export async function obtenerEvaluaciones(req, res) {
    try {
        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const evaluaciones=await evaluacionRepository.find();
        res.status(200).json(evaluaciones);
    }catch (error){
        res.status(500).json({message:"Error al obtener las evaluaciones"});
    }
}

export async function obtenerEvaluacionesPorEstudiante(req, res) {
    try {
        const { id_estudiante } = req.params;
        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const evaluaciones = await evaluacionRepository.find({
            where: { id_estudiante: parseInt(id_estudiante) },
            order: { fecha_evaluacion: "DESC" }
        });
        res.status(200).json(evaluaciones);
    }catch (error){
        res.status(500).json({message:"Error al obtener el historial de evaluaciones"});
    }
}

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

export async function crearEvaluacion(req, res) {
    try {

        const {id_estudiante, id_instructor, fecha_evaluacion, clase_practica_id} = req.body;

        if(!id_estudiante || !id_instructor || !fecha_evaluacion){
            return res.status(400).json({message:"Faltan campos por completar"});
        }

        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const nuevaEvaluacion = evaluacionRepository.create({
            id_estudiante,
            id_instructor,
            fecha_evaluacion,
            clase_practica_id: clase_practica_id || null,
            estado: "en_progreso",
            falta_critica: false,
            faltas: []
        });

        await evaluacionRepository.save(nuevaEvaluacion);
        res.status(201).json(nuevaEvaluacion);
    }catch (error){
        res.status(500).json({message:"Error al crear la evaluacion"});
    }
}

export async function registrarFalta(req, res) {
    try {
        const { id } = req.params;
        const { nombre_falta, es_critica } = req.body;

        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const evaluacion = await evaluacionRepository.findOneBy({ id_evaluacion: parseInt(id) });

        if (!evaluacion) {
            return res.status(404).json({ message: "Evaluación no encontrada" });
        }

        if(es_critica){
            evaluacion.falta_critica=true;
            evaluacion.estado="reprobado";
            evaluacion.puntaje_obtenido=0;
        }

        if(!evaluacion.faltas) evaluacion.faltas=[];
        evaluacion.faltas.push({nombre_falta, es_critica, fecha: new Date()});
        await evaluacionRepository.save(evaluacion);
        res.status(200).json(evaluacion);
    }catch (error){
        res.status(500).json({message:"Error al registrar la falta"});
    }
}

export async function finalizarEvaluacion(req, res) {
    try {
        const { id } = req.params;
        const { puntaje_obtenido, nota_final, observaciones } = req.body;

        const evaluacionRepository = AppDataSource.getRepository(EvaluacionPractica);
        const evaluacion = await evaluacionRepository.findOneBy({ id_evaluacion: parseInt(id) });

        if(!evaluacion){
            return res.status(404).json({message:"Evaluacion no encontrada"});
        }

        let notaParaClase = nota_final;

        if(evaluacion.falta_critica){
            evaluacion.puntaje_obtenido = 0;
            evaluacion.estado = "reprobado";
            notaParaClase = 1.0; 
        } else {
            evaluacion.puntaje_obtenido = puntaje_obtenido;
            evaluacion.estado = nota_final >= 4.0 ? "aprobado" : "reprobado"; 
        }

        evaluacion.observaciones = observaciones;

        await evaluacionRepository.save(evaluacion);

        if (evaluacion.clase_practica_id) {
            const clasesRepository = AppDataSource.getRepository(ClasePractica);
            const clase = await clasesRepository.findOneBy({ id: evaluacion.clase_practica_id });

            if (clase) {
                clase.calificacion = notaParaClase.toString(); 
                clase.estado = "Finalizada";
                await clasesRepository.save(clase);
            }
        }

        res.status(200).json(evaluacion);
    }catch(error){
        res.status(500).json({message:"Error al finalizar la evaluacion"});
    }
}

export async function actualizarEvaluacion(req, res) {
    try{
        const{id}=req.params;
        const{observaciones, puntaje_obtenido}=req.body;

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