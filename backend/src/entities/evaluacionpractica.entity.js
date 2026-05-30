"use strict";
import {EntitySchema}from "typeorm";

export const EvaluacionPractica=new EntitySchema({
    name:"EvaluacionPractica",
    tableName:"evaluacion_practica",
    columns:{
        id_evaluacion:{
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
            nullable:false,
        },
        fecha_evaluacion:{
            type:"timestamp",
            nullable:false,
        },
        puntaje_total:{
            type:"int",
            nullable:false,
            default:100,
        },
        puntaje_obtenido:{
            type:"int",
            nullable:true,
        },
        faltas:{
            type:"json",
            nullable:true,
        },
        falta_critica:{
            type:"boolean",
            nullable:false,
            default:false,
        },
        estado:{
            type:"enum",
            enum:["aprobado", "reprobado","en_progreso"],
            nullable:false,
            default:"en_progreso",
        },
        observaciones:{
            type:"text",
            nullable:true,
        },
    }
});