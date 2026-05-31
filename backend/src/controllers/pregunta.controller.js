import {AppDataSource} from "../config/configDb.js";
import {Pregunta} from "../entities/pregunta.entity.js";

export async function obtenerPreguntas(req,res){
    try{
        const preguntaRepository=AppDataSource.getRepository(Pregunta);
        const preguntas=await preguntaRepository.find();
        res.status(200).json(preguntas);
    }catch(error){
        res.status(500).json({message:"Error al obtener las preguntas"});
    }
}

export async function crearPregunta(req,res){
    try{
        const { texto_pregunta, categoria, opcion_a, opcion_b, opcion_c, opcion_d, respuesta_correcta, nivel_dificultad = "medio" } = req.body;
        
        if (!texto_pregunta || !categoria || !opcion_a || !opcion_b || !opcion_c || !opcion_d || !respuesta_correcta){
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const nuevaPregunta = preguntaRepository.create({
            texto_pregunta,
            categoria,
            opcion_a,
            opcion_b,
            opcion_c,
            opcion_d,
            respuesta_correcta,
            nivel_dificultad
        });
        await preguntaRepository.save(nuevaPregunta);
        res.status(201).json(nuevaPregunta);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la pregunta" });
    }
}

export async function eliminarPregunta(req,res){
    try{
        const {id}=req.params;
        const preguntaRepository=AppDataSource.getRepository(Pregunta);
        const pregunta=await preguntaRepository.findOneBy({id_pregunta:parseInt(id)});
        if(!pregunta){
            return res.status(404).json({message:"Pregunta no encontrada"});
        }

        await preguntaRepository.remove(pregunta);
        res.status(200).json({message:"Pregunta eliminada correctamente"});
    } catch (error) {
        res.status(500).json({message:"Error al eliminar la pregunta"});
    }
}