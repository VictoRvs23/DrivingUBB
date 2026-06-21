"use strict";
import { EntitySchema } from "typeorm";

export const PreguntaFrecuente = new EntitySchema({
  name: "PreguntaFrecuente",
  tableName: "preguntas_frecuentes",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    pregunta: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    respuesta: {
      type: "text",
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});