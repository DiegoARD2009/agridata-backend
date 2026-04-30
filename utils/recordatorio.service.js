import cron from "node-cron";
import Actividad from "../models/Actividad.js";
import Cultivo from "../models/Cultivo.js";
import User from "../models/User.js";
import { sendRecordatorio } from "./emailService.js";

// ── Lógica principal de envío ─────────────────────────────────────────
export const enviarRecordatoriosDelDia = async () => {
  const hoy = new Date();

  const inicioDia = new Date(Date.UTC(
    hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0
  ));
  const finDia = new Date(Date.UTC(
    hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59
  ));

  const actividades = await Actividad.find({
    fechaProgramada: { $gte: inicioDia, $lte: finDia },
    estado: { $in: ["Pendiente", "En progreso"] }
  });

  console.log(`📋 Actividades para hoy: ${actividades.length}`);

  for (const actividad of actividades) {
    try {
      const cultivo = await Cultivo.findById(actividad.cultivoId);
      const usuario = await User.findById(actividad.usuarioId);
      if (!cultivo || !usuario) continue;

      await sendRecordatorio(
        usuario.email,
        usuario.nombre,
        cultivo.nombre || cultivo.variedad,
        actividad.tipoActividad,
        actividad.fechaProgramada
      );

      console.log(`✅ Recordatorio enviado → ${usuario.email} | ${actividad.tipoActividad}`);

    } catch (err) {
      console.error(`❌ Error en recordatorio:`, err.message);
    }
  }
};

export const iniciarRecordatorios = () => {
  cron.schedule("0 12 * * *", async () => {
    console.log("⏰ Ejecutando recordatorios diarios...");
    await enviarRecordatoriosDelDia();
  }, {
    timezone: "America/Mexico_City"
  });

  console.log("✅ Recordatorios iniciados — se ejecutan diario a las 12:00pm");
};