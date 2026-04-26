import{User}from"./user.entity.js";

"use strict";
import { EntitySchema } from "typeorm";

export const ClaseTeorica = new EntitySchema({
  name: "ClaseTeorica",
  tableName: "clases_teoricas",
  columns: {
    id_clase:{
        primary:true,
        type:"int",
        generated:"increment",
    },
    titulo_clase:{
        type:"varchar",
        length:50,
        nullable:false,
    },
    fecha_hora:{
        type:"timestamp",
        nullable:false,
    },
    id_profesor:{
        type:"int",
        nullable:false,
    },
    enlace_videollamada:{
        type:"varchar",
        length:255,
        nullable:false,
    },
    estado_clase:{
        type:"enum",
        enum:["programada","en_curso","finalizada"],
        default:"programada",
    },
    creado_en:{
        type:"timestamp",
        default: () => "CURRENT_TIMESTAMP",
    },
    actualizado_en:{
        type:"timestamp",
        default: () => "CURRENT_TIMESTAMP",
        onUpdate: "CURRENT_TIMESTAMP",
    },
    relations:{
        profesor:{
            type:"many-to-one",
            target:"User",
            joinColumn:{ name:"id_profesor" },
        }
    }
  },
});