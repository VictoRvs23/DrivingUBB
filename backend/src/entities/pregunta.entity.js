"use strict";
import { EntitySchema } from "typeorm";

export const Pregunta = new EntitySchema({
  name: "Pregunta",
  tableName: "preguntas",
  columns: {
        id_pregunta: {
            primary: true,
            type: "int",
            generated: "increment",
        },
    texto_pregunta:{
        type:"text",
        nullable:false,
    },
    categoria:{
        type:"enum",
        enum:["señales", "mecanica", "leyes"],
        nullable:false,
    },
    opcion_a:{
        type:"varchar",
        length:255,
        nullable:false,
    },
    opcion_b:{
        type:"varchar",
        length:255, 
        nullable:false,
    },
    opcion_c:{
        type:"varchar",
        length:255,
        nullable:false,
    },
    opcion_d:{
        type:"varchar",
        length:255,
        nullable:false,
    },
    respuesta_correcta:{
        type:"char",
        length:1,
        nullable:false,
    },
    nivel_dificultad:{
        type:"enum",
        enum:["facil", "medio", "dificil"],
        nullable:false,
        default:"medio",
    },
    created_at:{
        type:"timestamp",
        nullable:false,
        default: () => "CURRENT_TIMESTAMP",
    },
  },
});