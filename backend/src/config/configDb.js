"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, DB_PASSWORD, DB_PORT } from "./configEnv.js";
import { User } from "../entities/user.entity.js";
import { Reserva } from "../entities/reservas.entity.js";
import { createUsers } from "./initDb.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${HOST}`,
  port: `${DB_PORT}`,
  username: `${DB_USERNAME}`,
  password: `${DB_PASSWORD}`,
  database: `${DATABASE}`,
  entities: [User, Reserva],
  synchronize: true,
  logging: false,
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