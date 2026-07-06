import { EntitySchema } from "typeorm";

export const Instructor = new EntitySchema({
  name: "Instructor",
  tableName: "instructores",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    userId: {
      type: "int",
      unique: true,
      nullable: false,
    },
    tipo_licencia: {
      type: "varchar",
      length: 10,
      nullable: false,
    },
    fecha_contratacion: {
      type: "date",
      nullable: false,
    }
  },
  relations: {
    user: {
      target: "User",
      type: "one-to-one",
      joinColumn: { 
        name: "userId" 
      },
      onDelete: "CASCADE",
    },
  },
});