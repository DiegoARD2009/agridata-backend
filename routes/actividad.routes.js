// backend/routes/actividad.routes.js
import express from "express";
import { verificarToken } from "../middleware/auth.middleware.js";
import { getActividades, crearActividad, editarActividad, eliminarActividad } from "../controllers/actividad.controller.js";

const router = express.Router();

router.use(verificarToken);

router.get("/", getActividades);
router.post("/", crearActividad);
router.put("/:id", editarActividad);
router.delete("/:id", eliminarActividad);

export default router;