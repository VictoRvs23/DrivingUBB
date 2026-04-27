"use strict";
import { EntitySchema } from "typeorm";

export const ReporteError = new EntitySchema({
  name: "ReporteError",
  tableName: "reportes_error",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    titulo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: false,
    },
    pasos_replicar: {
      type: "text",
      nullable: false,
    },
    adjunto_foto: {
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