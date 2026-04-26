import { EntitySchema } from "typeorm";

export const ClasePractica = new EntitySchema({
  name: "ClasePractica",
  tableName: "clases_practicas",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    numero_clase: {
      type: "int",
      nullable: false,
    },
    tema: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    fecha_hora: {
      type: "timestamp",
      nullable: false,
    },
    calificacion: {
      type: "decimal",
      precision: 2,
      scale: 1, 
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "Pendiente",
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
    alumno: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "alumno_id" },
      onDelete: "CASCADE",
    },
    instructor: {
      target: "User",
      type: "many-to-one",
      joinColumn: { name: "instructor_id" },
      onDelete: "SET NULL",
    },
  },
});