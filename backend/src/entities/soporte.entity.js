"use strict";
import { EntitySchema } from "typeorm";

export const Soporte = new EntitySchema({
  name: "Soporte",
  tableName: "soportes",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    tipo: {
      type: "varchar",
      length: 50,
      nullable: false, // Solo aceptará: 'Duda', 'Error', 'Reclamo', 'Sugerencia'
    },
    titulo: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: false,
    },
    imagen_adjunta: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    respuesta_admin: {
      type: "text",
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "sin respuesta", // Estados: sin respuesta, respondido, eliminado
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    usuario: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "usuario_id",
      },
      onDelete: "CASCADE",
    },
  },
});