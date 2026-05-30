import {AppDataSource} from "../config/configDb.js";
import {Pregunta} from "../entities/pregunta.entity.js";
import {ExamenTeorico} from "../entities/examenteorico.entity.js";

//Get obtener prguntas
export async function obtenerPreguntas(req,res){
    try{
        const preguntaRepository=AppDataSource.getRepository(Pregunta);
        const preguntas=await preguntaRepository.find();
        res.status(200).json(preguntas);
    }catch(error){
        res.status(500).json({message:"Error al obtener las preguntas"});
    }
}

//Examen aleatorio de preguntas
export async function generarExamenAleatorio(req,res){
    try{
        const{id_estudiante,cantidad_preguntas=10, tiempo_limite_segundos=3600}=req.body;
        
        if (!id_estudiante){
            return res.status(400).json({message:"id_estudiante es requerido"});
        }

        //obtener todas las preguntas
        const preguntaRepository=AppDataSource.getRepository(Pregunta);
        const todasLasPreguntas=await preguntaRepository.find();

        //suficientes preguntas
        if (todasLasPreguntas.length < cantidad_preguntas) {
            return res.status(400).json({ 
                message: `No hay suficientes preguntas. Disponibles: ${todasLasPreguntas.length}` 
            });
        }

        //preguntas al azar
        const preguntasAleatorias=[];
        const IndicesUsados=new Set();

        while (preguntasAleatorias.length<cantidad_preguntas){
            const indice=Math.floor(Math.random()*todasLasPreguntas.length);
            if(!indicesUsados.has(indice)){
                preguntasAleatorias.push(todasLasPreguntas[indice].id_pregunta);
                indicesUsados.add(indice);
            }
        }

        //Crear nuevo examen
        const examenRepository=AppDataSource.getRepository(ExamenTeorico);
        const nuevoExamen=examenRepository.create({
            id_estudiante,
            preguntas_asignadas:preguntasAleatorias,
            tiempo_limite_segundos,
            estado:"en_progreso"
        });

        await examenRepository.save(nuevoExamen);

    //retornar examen con las preguntas (sin las respuestas correctas)
    const preguntasParaEstudiante=todasLasPreguntas
    .filter(p=>preguntasAleatorias.includes(p.id_pregunta))
    .map(p=>({
        id_pregunta:p.id_pregunta,
        texto_pregunta:p.texto_pregunta,
        categoria:p.categoria,
        opcion_a: p.opcion_a,
        opcion_b:p.opcion_b,
        opcion_c:p.opcion_c,
        opcion_d:p.opcion_d,
        //sin respuesta correcta
    }));
    res.status(201).json({
        id_examen:nuevoExamen.id_examen,
        preguntas:preguntasParaEstudiante,
        tiempo_limite_segundos,
        cantidad_preguntas
    });
    }catch(error){
        res.status(500).json({message:"Error al generar el examen"});
    }
}

