import mongoose from "mongoose";

const actividadSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true  // ← agrega esto
  },
  cultivoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cultivo"
  },
  tipoActividad: String,
  descripcion: String,
  insumo: {
    nombre: String,
    cantidad: Number,
    unidad: String
  },
  fechaRegistro: Date,
  fechaProgramada: Date,
  estado: {
    type: String,
    default: "Pendiente"
  }
});

export default mongoose.model("Actividad", actividadSchema);