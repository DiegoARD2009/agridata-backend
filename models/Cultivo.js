import mongoose from "mongoose";

const cultivoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  nombre: {        
    type: String,
  },
  tipo: String,
  variedad: String,
  superficie: Number,
  unidadSuperficie: String,
  fechaSiembra: Date,

  estado: {
    type: String,
    default: "Activo"
  },

  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Cultivo", cultivoSchema);