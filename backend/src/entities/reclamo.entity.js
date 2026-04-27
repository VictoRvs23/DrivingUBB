"use strict";
import { EntitySchema } from "typeorm";

export const Reclamo = new EntitySchema({
  name: "Reclamo",
  tableName: "reclamos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    motivo: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    fecha_incidente: {
      type: "date",
      nullable: false,
    },
    detalles: {
      type: "text",
      nullable: false,
    },
    evidencia_foto: {
      type: "varchar",
      length: 255,
      nullable: false, // Es obligatorio según tus requerimientos
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