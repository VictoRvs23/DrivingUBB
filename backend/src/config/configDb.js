"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, DB_PASSWORD, DB_PORT } from "./configEnv.js";
import { User } from "../entities/user.entity.js";
import { Duda } from "../entities/duda.entity.js";
import { ReporteError } from "../entities/error.entity.js";
import { Reclamo } from "../entities/reclamo.entity.js";
import { Sugerencia } from "../entities/sugerencia.entity.js";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${HOST}`,
  port: `${DB_PORT}`,
  username: `${DB_USERNAME}`,
  password: `${DB_PASSWORD}`,
  database: `${DATABASE}`,
  entities: [User, Duda, ReporteError, Reclamo, Sugerencia],
  synchronize: true,
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión a BD exitosa");

  } catch (error) {
    console.error("=> Error al conectar a BD:", error);
    throw error;
  }
}
