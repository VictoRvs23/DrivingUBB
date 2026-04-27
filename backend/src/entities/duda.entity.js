"use strict";
import { EntitySchema } from "typeorm";

export const Duda = new EntitySchema({
  name: "Duda",
  tableName: "dudas",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    asunto: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    mensaje: {
      type: "text",
      nullable: false,
    },
    respuesta_admin: {
      type: "text",
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "pendiente",
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