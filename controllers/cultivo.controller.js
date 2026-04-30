import Cultivo from "../models/Cultivo.js";
import Actividad from "../models/Actividad.js";
import { calcularEstado, calcularInfoCultivo } from "../utils/cultivo.utils.js";

export const getCultivos = async (req, res) => {
  try {
    const cultivos = await Cultivo.find({ usuarioId: req.user.id });

    // Recalcula el estado de cada cultivo en tiempo real
    const cultivosActualizados = cultivos.map(c => {
      const info = calcularInfoCultivo(c.variedad, c.fechaSiembra);
      return {
        ...c.toObject(),
        estado: info.estado,
        diasTranscurridos: info.diasTranscurridos,
        porcentajeAvance: info.porcentajeAvance,
        diasParaSiguienteEtapa: info.diasParaSiguienteEtapa,
        siguienteEtapa: info.siguienteEtapa
      };
    });

    res.json(cultivosActualizados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cultivos", error });
  }
};

export const crearCultivo = async (req, res) => {
  try {
    const { tipo, variedad, superficie, unidadSuperficie, fechaSiembra } = req.body;

    // Contar cultivos del mismo tipo para el nombre
    const cantidad = await Cultivo.countDocuments({
      usuarioId: req.user.id,
      variedad
    });
    const nombreCultivo = `${variedad} ${cantidad + 1}`;

    // Calcular estado automáticamente
    const fechaSiembraParsed = new Date(fechaSiembra + 'T12:00:00.000Z');
    const estadoCalculado = calcularEstado(variedad, fechaSiembraParsed);

    const cultivo = new Cultivo({
      usuarioId: req.user.id,
      nombre: nombreCultivo,
      tipo,
      variedad,
      superficie,
      unidadSuperficie,
      fechaSiembra: fechaSiembraParsed,
      estado: estadoCalculado  // ← calculado automáticamente
    });

    await cultivo.save();
    res.json({ message: "Cultivo creado", cultivo });

  } catch (error) {
    res.status(500).json({ message: "Error al crear cultivo", error });
  }
};


export const editarCultivo = async (req, res) => {
  try {
    const cultivo = await Cultivo.findOne({
      _id: req.params.id,
      usuarioId: req.user.id
    });

    if (!cultivo) return res.status(404).json({ message: "Cultivo no encontrado" });

    if (req.body.fechaSiembra) {
  const fechaParsed = new Date(req.body.fechaSiembra + 'T12:00:00.000Z');

  // ← Verifica que la fecha sea válida antes de continuar
  if (isNaN(fechaParsed.getTime())) {
    return res.status(400).json({ message: "Fecha de siembra inválida" });
  }

  const actividades = await Actividad.countDocuments({
    cultivoId: cultivo._id
  });

  if (actividades > 0) {
    return res.status(400).json({
      message: `No puedes cambiar la fecha de siembra porque este cultivo tiene ${actividades} actividad(es) registrada(s).`
    });
  }

  req.body.estado = calcularEstado(cultivo.variedad, fechaParsed);
  req.body.fechaSiembra = fechaParsed;
}

    if (req.body.variedad && req.body.variedad !== cultivo.variedad) {
      const fechaRef = req.body.fechaSiembra || cultivo.fechaSiembra;
      req.body.estado = calcularEstado(req.body.variedad, fechaRef);
    }

    const cultivoActualizado = await Cultivo.findOneAndUpdate(
      { _id: req.params.id, usuarioId: req.user.id },
      req.body,
      { new: true }
    );

    res.json({ message: "Cultivo actualizado", cultivo: cultivoActualizado });

  } catch (error) {
    console.log("❌ Error detallado editar cultivo:", error.message); // ← agrega esto
    console.log("❌ Stack:", error.stack); // ← y esto
    res.status(500).json({ message: "Error al editar cultivo", error });
  }
};
export const eliminarCultivo = async (req, res) => {
  try {
    const cultivo = await Cultivo.findOne({
      _id: req.params.id,
      usuarioId: req.user.id
    });

    if (!cultivo) return res.status(404).json({ message: "Cultivo no encontrado" });

    // Verificar si tiene actividades
    const actividades = await Actividad.countDocuments({
      cultivoId: cultivo._id
    });

    if (actividades > 0) {
      return res.status(400).json({
        message: `No puedes eliminar este cultivo porque tiene ${actividades} actividad(es) registrada(s). Elimina las actividades primero.`
      });
    }

    await Cultivo.findOneAndDelete({ _id: req.params.id, usuarioId: req.user.id });
    res.json({ message: "Cultivo eliminado" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cultivo", error });
  }
};