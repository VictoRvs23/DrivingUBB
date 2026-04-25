"use strict";
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/configDb.js";
import indexRoutes from "./routes/index.routes.js"; 
import { PORT, HOST, FRONTEND_URL } from "./config/configEnv.js";

const app = express();

const allowedOrigins = [FRONTEND_URL || "http://localhost:5173"];
app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  allowedHeaders: ['Content-Type', 'Authorization']
})); 

app.use(morgan("dev")); 
app.use(express.json()); 

app.get("/", (req, res) => {
  res.send("Servidor Escuela de Manejo - Sistema activo");
});


async function startServer() {
  try {
    await connectDB();
    
    app.use("/api", indexRoutes);

    app.listen(PORT, () => {
      console.log(`\n==========================================`);
      console.log(`🚀 Servidor activo en: http://${HOST}:${PORT}`);
      console.log(`==========================================\n`);
    });
  } catch (error) {
    console.error("❌ Error crítico al iniciar el servidor:", error);
    process.exit(1); 
  }
}

startServer();