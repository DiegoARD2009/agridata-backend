import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  nombre: String,
  apellidopaterno: String,
  apellidomaterno: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  telefono: String,
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  emailVerified: {
  type: Boolean,
  default: false,
},
});

export default mongoose.model("User", userSchema);




