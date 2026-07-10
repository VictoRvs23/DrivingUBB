"use strict";
import { EntitySchema } from "typeorm";

export const ClaseTeorica = new EntitySchema({
  name: "ClaseTeorica",
  tableName: "clases_teoricas",
  columns: {
    id_clase: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    titulo_clase: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    fecha_hora: {
      type: "timestamp",
      nullable: false,
    },
    enlace_videollamada: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    codigo_acceso: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    profesor: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "id_profesor" },
      onDelete: "CASCADE",
    },
  },
});