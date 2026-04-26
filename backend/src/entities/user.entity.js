"use strict";
import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: true, 
    },
    role: {
      type: "varchar",
      length: 50,
      nullable: false,
      default: "alumno",
    },
    isApproved: {
      type: "boolean",
      default: false, 
    },
    numeroTelefonico: {
      type: "varchar",
      length: 15,
      nullable: true,
    },
    rut: {
      type: "varchar",
      length: 20,
      nullable: true,
    },
    userImage: {
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
});