"use strict";
import { EntitySchema } from "typeorm";

export const Sugerencia = new EntitySchema({
  name: "Sugerencia",
  tableName: "sugerencias",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    categoria: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    descripcion_idea: {
      type: "text",
      nullable: false,
    },
    adjunto_idea: {
      type: "varchar",
      length: 255,
      nullable: true,
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