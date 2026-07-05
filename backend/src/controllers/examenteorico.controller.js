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
        const{id_estudiante,tiempo_limite_segundos=3600}=req.body;
        
        if (!id_estudiante){
            return res.status(400).json({message:"id_estudiante es requerido"});
        }

        //obtener todas las preguntas
        const preguntaRepository=AppDataSource.getRepository(Pregunta);
        const todasLasPreguntas=await preguntaRepository.find();

        if (todasLasPreguntas.length === 0) {
            return res.status(400).json({
                message: "No hay preguntas registradas para generar el examen"
            });
        }

        const distribucionCategorias={señales:4,mecanica:3,leyes:3};

        // preguntas elegidas para el examen
        const preguntasSeleccionadas=[];
        const idsUsados=new Set();

        // toma preguntas de forma controlada por categoría
        for (const [categoria, cantidad] of Object.entries(distribucionCategorias)) {
            const preguntasCategoria = todasLasPreguntas.filter(
                (pregunta) => pregunta.categoria === categoria
            );

            if (preguntasCategoria.length === 0) {
                continue;
            }

            const cantidadReal = Math.min(cantidad, preguntasCategoria.length);

            while (
                preguntasSeleccionadas.filter((p) => p.categoria === categoria).length < cantidadReal
            ) {
                const preguntaAleatoria = preguntasCategoria[
                    Math.floor(Math.random() * preguntasCategoria.length)
                ];

                if (!idsUsados.has(preguntaAleatoria.id_pregunta)) {
                    preguntasSeleccionadas.push(preguntaAleatoria);
                    idsUsados.add(preguntaAleatoria.id_pregunta);
                }
            }
        }

        const totalDeseado=10;
        const preguntasRestantes=todasLasPreguntas.filter(
            (pregunta)=>!idsUsados.has(pregunta.id_pregunta)
        );

        while (preguntasSeleccionadas.length < totalDeseado && preguntasRestantes.length > 0) {
            const indice = Math.floor(Math.random() * preguntasRestantes.length);
            const pregunta = preguntasRestantes[indice];

            if (!idsUsados.has(pregunta.id_pregunta)) {
                preguntasSeleccionadas.push(pregunta);
                idsUsados.add(pregunta.id_pregunta);
            }
            preguntasRestantes.splice(indice, 1);
        }

        if (preguntasSeleccionadas.length===0) {
            return res.status(400).json({
                message: "No hay suficientes preguntas para generar el examen"
            });
        }

        const examenRepository = AppDataSource.getRepository(ExamenTeorico);
        const nuevoExamen = examenRepository.create({
            id_estudiante,
            preguntas_asignadas: preguntasSeleccionadas.map((p) => p.id_pregunta),
            tiempo_limite_segundos,
            estado: "en_progreso"
        });

        await examenRepository.save(nuevoExamen);

        const preguntasParaEstudiante=preguntasSeleccionadas.map((p)=>({
            id_pregunta:p.id_pregunta,
            texto_pregunta:p.texto_pregunta,
            categoria:p.categoria,
            opcion_a:p.opcion_a,
            opcion_b:p.opcion_b,
            opcion_c:p.opcion_c,
            opcion_d:p.opcion_d,
        }));

        // respuesta final
        res.status(201).json({
            id_examen:nuevoExamen.id_examen,
            preguntas:preguntasParaEstudiante,
            tiempo_limite_segundos,
            cantidad_preguntas:preguntasParaEstudiante.length
        });
    }catch(error){
        res.status(500).json({message:"Error al generar examen"});
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

        const respuestasEstudiante = Array.isArray(examen.respuestas_estudiante)
            ? examen.respuestas_estudiante
            : [];

        //obtener todas las preguntas para verificar respuestas
        const todasLasPreguntas=await preguntaRepository.find();

        //contar respuestas correctas
        let respuestasCorrectas=0;
        const retroalimentacion=[];

        respuestasEstudiante.forEach(respuesta=>{
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
        const totalRespuestas = respuestasEstudiante.length;
        const puntaje = totalRespuestas > 0
            ? Math.round((respuestasCorrectas / totalRespuestas) * 100)
            : 0;

        //actualizar examen
        examen.puntaje_obtenido=puntaje;
        examen.estado="finalizado";
        examen.fecha_finalizacion=new Date();
        examen.retroalimentacion=JSON.stringify({
            respuestas_correctas:respuestasCorrectas,
            total_respuestas:totalRespuestas,
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

//obtener historial de examenes de un estudiante especifico
export async function obtenerExamenesPorEstudiante(req,res){
    try{
        const {id_estudiante}=req.params;
        const examenRepository=AppDataSource.getRepository(ExamenTeorico);
        const examenes=await examenRepository.find({
            where:{id_estudiante:parseInt(id_estudiante)},
            order:{fecha_examen:"DESC"}
        });

        //parsea la retroalimentacion guardada como texto para que el frontend la reciba como objeto
        const examenesFormateados=examenes.map(examen=>({
            id_examen:examen.id_examen,
            fecha_examen:examen.fecha_examen,
            fecha_finalizacion:examen.fecha_finalizacion,
            estado:examen.estado,
            puntaje_obtenido:examen.puntaje_obtenido,
            puntaje_total:examen.puntaje_total,
            retroalimentacion: examen.retroalimentacion ? JSON.parse(examen.retroalimentacion) : null,
        }));

        res.status(200).json(examenesFormateados);
    }catch(error){
        res.status(500).json({message:"Error al obtener el historial de examenes"});
    }
}

//obtener examen por id
export async function obtenerExamenPorId(req,res){
    try{
        const {id}=req.params;
        const examenRepository=AppDataSource.getRepository(ExamenTeorico);
        const examen=await examenRepository.findOneBy({id_examen:parseInt(id)});
        if(!examen){
            return res.status(404).json({message:"Examen no encontrado"});
        }
        res.status(200).json(examen);
    }catch(error){
        res.status(500).json({message:"Error al obtener el examen"});
    }
}

//obtener resultados de un estudiante
export async function obtenerResultado(req,res){
    try{
        const{id}=req.params;
        const examenRepository=AppDataSource.getRepository(ExamenTeorico);
        const examen=await examenRepository.findOneBy({id_examen: parseInt(id)});
        
        if(!examen){
            return res.status(404).json({message:"Examen no encontrado"});
        }

        if(examen.estado!=="finalizado"){
            return res.status(400).json({message:"El examen aún no ha finalizado"});
        }

        const retroalimentacionParsed= examen.retroalimentacion
        ? JSON.parse(examen.retroalimentacion)
        :{};
        //devuelve datos guardados al frontend 
        res.status(200).json({
            id_examen: examen.id_examen,
            puntaje: examen.puntaje_obtenido,
            estado:examen.estado,
            respuestas_correctas:retroalimentacionParsed.respuestas_correctas||0,
            respuestas_incorrectas:retroalimentacionParsed.total_respuestas-(retroalimentacionParsed.respuestas_correctas||0),
            preguntas_incorrectas: retroalimentacionParsed.preguntas_incorrectas||[],
            total_respuestas:retroalimentacionParsed.total_respuestas||0,
            fecha_finalizacion:examen.fecha_finalizacion
        });

    }catch(error){
        res.status(500).json({message:"Error al obtener el resultado"});
    }
}

