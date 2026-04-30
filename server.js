import dotenv from "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import actividadRoutes from "./routes/actividad.routes.js";
import cultivoRoutes from "./routes/cultivo.routes.js";
import { iniciarRecordatorios, enviarRecordatoriosDelDia } from "./utils/recordatorio.service.js";

const app = express();


// CORS con variables de entorno
const corsOptions = {
  origin: [
    'http://localhost:4200',
    'https://agridata-frontend.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true // Elimina valores falsy
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Conectar DB
connectDB();

//Recordatorios
iniciarRecordatorios();

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/actividades", actividadRoutes);
app.use("/api/cultivos", cultivoRoutes);


// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.get("/test-recordatorio", async (req, res) => {
  await enviarRecordatoriosDelDia();
  res.json({ message: "✅ Recordatorios enviados manualmente" });
});

// Servidor
app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor en puerto", process.env.PORT || 3000);
});