import Actividad from "../models/Actividad.js";

// GET — solo actividades del usuario logueado
export const getActividades = async (req, res) => {
  try {
    const filtro = { usuarioId: req.user.id };
    if (req.query.cultivoId) filtro.cultivoId = req.query.cultivoId;

    const actividades = await Actividad.find(filtro)
      .populate("cultivoId", "tipo variedad");
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener actividades", error });
  }
};

// POST — guardar con usuarioId
export const crearActividad = async (req, res) => {
  try {
    const { cultivoId, tipoActividad, descripcion, insumo, fechaRegistro, fechaProgramada, estado } = req.body;

    // Convierte la fecha agregando mediodía para evitar desfase de zona horaria
    const parsearFecha = (fecha) => {
      if (!fecha) return undefined;
      return new Date(fecha + 'T12:00:00.000Z');
    };

    const actividad = new Actividad({
      usuarioId: req.user.id,
      cultivoId,
      tipoActividad,
      descripcion,
      insumo,
      fechaRegistro: parsearFecha(fechaRegistro) || new Date(),
      fechaProgramada: parsearFecha(fechaProgramada),
      estado
    });

    await actividad.save();
    res.json({ message: "Actividad creada", actividad });
  } catch (error) {
    res.status(500).json({ message: "Error al crear actividad", error });
  }
};

// PUT — solo el dueño puede editar
export const editarActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findOneAndUpdate(
      { _id: req.params.id, usuarioId: req.user.id },
      req.body,
      { new: true }
    );
    if (!actividad) return res.status(404).json({ message: "Actividad no encontrada" });
    res.json({ message: "Actividad actualizada", actividad });
  } catch (error) {
    res.status(500).json({ message: "Error al editar actividad", error });
  }
};

// DELETE — solo el dueño puede eliminar
export const eliminarActividad = async (req, res) => {
  try {
    const actividad = await Actividad.findOneAndDelete({
      _id: req.params.id,
      usuarioId: req.user.id
    });
    if (!actividad) return res.status(404).json({ message: "Actividad no encontrada" });
    res.json({ message: "Actividad eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar actividad", error });
  }
};