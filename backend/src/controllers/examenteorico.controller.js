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
        const indicesUsados=new Set();

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

//funcion 4:guardar respuestas del estudiante
export async function guardarRespuestas(req,res){
    try{
        const {id}=req.params;
        const {respuestas}=req.body;

        const examenRepository=AppDataSource.getRepository(ExamenTeorico);
        const examen=await examenRepository.findOneBy({id_examen:parseInt(id)});
        
        if(!examen){
            return res.status(404).json({message:"Examen no encontrado"});
        }

        //guardar respuestas
        examen.respuestas_estudiante=respuestas;
        await examenRepository.save(examen);

        res.status(200).json({message:"Respuestas guardadas",id_examen:examen.id_examen});
    }catch(error){
        res.status(500).json({message:"Error al guardar las respuestas"});
    }
    
}

//funcion 5:finalizar examen y corregir automaticamente
export async function finalizarExamen(req,res){
    try{
        const {id}=req.params;

        const examenRepository=AppDataSource.getRepository(ExamenTeorico);
        const preguntaRepository=AppDataSource.getRepository(Pregunta);

        const examen=await examenRepository.findOneBy({id_examen:parseInt(id)});

        if(!examen){
            return res.status(404).json({message:"Examen no encontrado"});
        }

        //obtener todas las preguntas para verificar respuestas
        const todasLasPreguntas=await preguntaRepository.find();

        //contar respuestas correctas
        let respuestasCorrectas=0;
        const retroalimentacion=[];

        examen.respuestas_estudiante.forEach(respuesta=>{
            const pregunta=todasLasPreguntas.find(p=>p.id_pregunta===respuesta.id_pregunta);
            if(pregunta){
                const esCorrecta=respuesta.respuesta_dada===pregunta.respuesta_correcta;

                if(esCorrecta){
                    respuestasCorrectas++;
                }else{
                    retroalimentacion.push({
                        id_pregunta:pregunta.id_pregunta,
                        texto:pregunta.texto_pregunta,
                        respuesta_correcta:pregunta.respuesta_correcta,
                        respuesta_dada:respuesta.respuesta_dada,
                    });
                }
            }
        });

        //calcular puntaje (respuestas correctas/total*100)
        const puntaje=Math.round((respuestasCorrectas/examen.respuestas_estudiante.length)*100);
    
        //actualizar examen
        examen.puntaje_obtenido=puntaje;
        examen.estado="finalizado";
        examen.fecha_finalizacion=new Date();
        examen.retroalimentacion=JSON.stringify({
            respuestas_correctas:respuestasCorrectas,
            total_respuestas:examen.respuestas_estudiante.length,
            porcentaje:puntaje,
            preguntas_incorrectas:retroalimentacion,
            aprobo:puntaje>=60
        });

        await examenRepository.save(examen);

        res.status(200).json({
            id_examen:examen.id_examen,
            puntaje_obtenido:puntaje,
            estado:"finalizado",
            aprobo:puntaje>=60,
            retroalimentacion:JSON.parse(examen.retroalimentacion)
        });
    }catch(error){
        res.status(500).json({message:"Error al finalizar el examen"});
    }
}

