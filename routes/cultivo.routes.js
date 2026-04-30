// backend/routes/cultivo.routes.js
import express from "express";
import { verificarToken } from "../middleware/auth.middleware.js";
import { getCultivos, crearCultivo, editarCultivo, eliminarCultivo } from "../controllers/cultivo.controller.js";

const router = express.Router();

router.use(verificarToken); // protege todas las rutas

router.get("/", getCultivos);
router.post("/", crearCultivo);
router.put("/:id", editarCultivo);
router.delete("/:id", eliminarCultivo);

export default router;