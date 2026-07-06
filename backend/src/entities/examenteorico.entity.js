"use strict";
import { EntitySchema } from "typeorm";

export const ExamenTeorico=new EntitySchema({
    name:"examenes_teoricos",
    tableName:"examenes_teoricos",
    columns:{
        id_examen:{
            primary:true,
            type:"int",
            generated:"increment",
        },
        id_estudiante:{
            type:"int",
            nullable:false,
        },
        id_instructor:{
            type:"int",
            nullable:true,
        },
        fecha_examen:{
            type:"timestamp",
            nullable:false,
            default: () => "CURRENT_TIMESTAMP",
        },
        preguntas_asignadas:{
            type:"json",
            nullable:false,
            comment:"Lista de preguntas asignadas al examen",
        },
        respuestas_estudiante:{
            type:"json",
            nullable:true,
            comment:"lista de respuestas del estudiante",
        },
        puntaje_obtenido:{
            type:"int",
            nullable:true,
            comment:"Puntaje obtenido en el examen",
        },
        puntaje_total:{
            type:"int",
            nullable:false,
            default:100,
        },
        tiempo_limite_segundos:{
            type:"int",
            nullable:false,
            default:3600, //tiempo en segundos (1 hora)
        },
        estado:{
            type:"enum",
            enum:["en_progreso","finalizado","enviado_automaticamente"],
            nullable:false,
            default:"en_progreso",
        },
        fecha_finalizacion:{
            type:"timestamp",
            nullable:true,
        },
        retroalimentacion:{
            type:"text",
            nullable:true,
            comment:"retroalimentacion para el estudiante ante faltas y areas a mejorar"
        },
    },
});