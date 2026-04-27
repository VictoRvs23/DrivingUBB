"use strict";
import { EntitySchema } from "typeorm";

export const Reserva = new EntitySchema({
  name: "Reserva",
  tableName: "reservas",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    fecha: {
      type: "date",
      nullable: false,
    },
    hora: {
      type: "varchar",
      length: 10,
      nullable: false,
    },
  },
  relations: {
    user: {
      target: "User", 
      type: "many-to-one",
      joinColumn: { name: "userId" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});