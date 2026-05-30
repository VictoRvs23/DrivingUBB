"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, DB_PASSWORD, DB_PORT } from "./configEnv.js";
import { User } from "../entities/user.entity.js";
import { ClaseTeorica } from "../entities/claseteorica.entity.js";
import { EvaluacionPractica } from "../entities/evaluacionpractica.entity.js";
import { Pregunta } from "../entities/pregunta.entity.js";
import {Examenteorico}from "../entities/examenteorico.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${HOST}`,
  port: `${DB_PORT}`,
  username: `${DB_USERNAME}`,
  password: `${DB_PASSWORD}`,
  database: `${DATABASE}`,
  entities: [User, ClaseTeorica, EvaluacionPractica, Pregunta, Examenteorico],
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