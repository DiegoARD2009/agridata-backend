import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verificarToken } from "../middleware/auth.middleware.js";
import { sendVerificationEmail } from "../utils/emailService.js";
const router = express.Router();

// REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const userExistente = await User.findOne({ email });
    if (userExistente) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUser = new User({
      nombre,
      email,
      password: passwordHash,
      emailVerified: false 
    });

    await nuevoUser.save();

    const verificationToken = jwt.sign(
      { email: nuevoUser.email },
      process.env.EMAIL_SECRET,
      { expiresIn: "24h" }
    );

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(nuevoUser.email, nuevoUser.nombre, verificationUrl);

    res.json({ message: "Usuario registrado. Revisa tu correo para verificar tu cuenta." });

  } catch (error) {
    console.log("❌ Error detallado:", error.message);
    res.status(500).json({ message: "Error en registro", error });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    if (!user.emailVerified) {
  return res.status(403).json({
    message: "Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada."
  });
}
    
    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error en login", error });
  }
});

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    await User.findOneAndUpdate({ email: decoded.email }, { emailVerified: true });
    res.json({ message: "¡Correo verificado exitosamente! Ya puedes iniciar sesión." });
  } catch (err) {
    res.status(400).json({ message: "El enlace es inválido o ha expirado." });
  }
});

// GET perfil
router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener perfil" });
  }
});

// PUT editar perfil
router.put("/perfil", verificarToken, async (req, res) => {
  try {
    const { nombre, apellidopaterno, apellidomaterno, telefono } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { nombre, apellidopaterno, apellidomaterno, telefono },
      { new: true }
    ).select("-password");
    res.json({ message: "Perfil actualizado", user });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
});

// PUT cambiar contraseña
router.put("/password", verificarToken, async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const user = await User.findById(req.user.id);

    const valida = await bcrypt.compare(passwordActual, user.password);
    if (!valida) return res.status(400).json({ message: "Contraseña actual incorrecta" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(passwordNueva, salt);
    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar contraseña" });
  }
});

export default router;