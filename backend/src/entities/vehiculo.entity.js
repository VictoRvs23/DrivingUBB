import { EntitySchema } from "typeorm";

export const Vehiculo = new EntitySchema({
  name: "Vehiculo",
  tableName: "vehiculos",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    patente: {
      type: "varchar",
      length: 6,
      unique: true,
    },
    numeroMovil: {
      type: "int",
      unique: true,
      nullable: false,
    },
    estado: {
      type: "varchar",
      length: 30,
      default: "Disponible",
      nullable: false,
    },
    permiso_circulacion: { 
      type: "varchar",
      length: 50,
      nullable: true, 
    },
    revision_tecnica: {
      type: "varchar",
      length: 50,
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
    clases_practicas: {
      type: "one-to-many",
      target: "ClasePractica",
      inverseSide: "vehiculo", 
    },
  },
});