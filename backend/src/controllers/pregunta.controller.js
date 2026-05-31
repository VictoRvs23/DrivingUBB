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