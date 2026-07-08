"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, DB_PASSWORD, DB_PORT } from "./configEnv.js";
import { User } from "../entities/user.entity.js";
import { ClaseTeorica } from "../entities/claseteorica.entity.js";
import { EvaluacionPractica } from "../entities/evaluacionpractica.entity.js";
import { Pregunta } from "../entities/pregunta.entity.js";
import { ExamenTeorico } from "../entities/examenteorico.entity.js";
import { Soporte } from "../entities/soporte.entity.js";
import { Vehiculo } from "../entities/vehiculo.entity.js";
import { ClasePractica } from "../entities/clasesPracticas.entity.js";
import { Instructor } from "../entities/instructor.entity.js";
import { Reserva } from "../entities/reservas.entity.js";
import { createUsers } from "./initDb.js";
import { PreguntaFrecuente } from "../entities/preguntaFrecuente.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${HOST}`,
  port: `${DB_PORT}`,
  username: `${DB_USERNAME}`,
  password: `${DB_PASSWORD}`,
  database: `${DATABASE}`,
  entities: [
    User,
    ClaseTeorica,
    EvaluacionPractica,
    Pregunta,
    ExamenTeorico,
    Vehiculo,
    ClasePractica,
    Instructor,
    Reserva,
    Soporte,
    PreguntaFrecuente,
  ],
  synchronize: true,
  logging: false,
  dropSchema: true,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión a BD exitosa");

    await createUsers();

  } catch (error) {
    console.error("=> Error al conectar a BD:", error);
    throw error;
  }
}
