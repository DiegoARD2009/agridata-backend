
// Días para cada etapa por variedad
export const etapasPorVariedad = {
  // GRANOS
  'Maíz':           { diaActivo: 50,  finProduccion: 150 },
  'Frijol':         { diaActivo: 40,  finProduccion: 100 },
  'Sorgo':          { diaActivo: 45,  finProduccion: 120 },
  'Trigo':          { diaActivo: 60,  finProduccion: 150 },
  'Avena':          { diaActivo: 55,  finProduccion: 130 },

  // FRUTALES
  'Aguacate':       { diaActivo: 365, finProduccion: 9125 },
  'Durazno':        { diaActivo: 300, finProduccion: 5475 },
  'Manzana':        { diaActivo: 365, finProduccion: 9125 },
  'Pera':           { diaActivo: 365, finProduccion: 9125 },
  'Ciruela':        { diaActivo: 300, finProduccion: 5475 },
  'Guayaba':        { diaActivo: 250, finProduccion: 7300 },
  'Limón':          { diaActivo: 300, finProduccion: 7300 },

  // HORTALIZAS
  'Jitomate':       { diaActivo: 45,  finProduccion: 100 },
  'Tomate verde':   { diaActivo: 40,  finProduccion: 90  },
  'Lechuga':        { diaActivo: 25,  finProduccion: 70  },
  'Zanahoria':      { diaActivo: 45,  finProduccion: 100 },
  'Cebolla':        { diaActivo: 60,  finProduccion: 130 },
  'Chile':          { diaActivo: 50,  finProduccion: 150 },
  'Calabacita':     { diaActivo: 30,  finProduccion: 80  },
  'Papa':           { diaActivo: 45,  finProduccion: 120 },

  // FORRAJES
  'Alfalfa':        { diaActivo: 35,  finProduccion: 1825 },
  'Avena forrajera':{ diaActivo: 50,  finProduccion: 110  },
  'Maíz forrajero': { diaActivo: 45,  finProduccion: 100  },

  // INDUSTRIALES
  'Caña de azúcar': { diaActivo: 150, finProduccion: 3650 },
  'Café':           { diaActivo: 365, finProduccion: 9125 },
  'Fresa':          { diaActivo: 40,  finProduccion: 180  },
  'Zarzamora':      { diaActivo: 70,  finProduccion: 1825 },
};

/**
 * Calcula el estado del cultivo basado en días transcurridos
 * desde la fecha de siembra hasta hoy
 */
export const calcularEstado = (variedad, fechaSiembra) => {
  const hoy = new Date();
  const siembra = new Date(fechaSiembra);

  // Diferencia en días
  const diasTranscurridos = Math.floor(
    (hoy.getTime() - siembra.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Fecha futura → Planeación
  if (diasTranscurridos < 0) {
    return 'Planeación';
  }

  const etapas = etapasPorVariedad[variedad];

  // Variedad no encontrada → estado genérico
  if (!etapas) {
    if (diasTranscurridos === 0) return 'Planeación';
    return 'En crecimiento';
  }

  const { diaActivo, finProduccion } = etapas;

  if (diasTranscurridos >= finProduccion) {
    return 'Fin de producción';
  } else if (diasTranscurridos >= diaActivo) {
    return 'Activo';
  } else {
    return 'En crecimiento';
  }
};

/**
 * Retorna información adicional del cultivo
 * para mostrar en el frontend
 */
export const calcularInfoCultivo = (variedad, fechaSiembra) => {
  const hoy = new Date();
  const siembra = new Date(fechaSiembra);
  const diasTranscurridos = Math.floor(
    (hoy.getTime() - siembra.getTime()) / (1000 * 60 * 60 * 24)
  );

  const etapas = etapasPorVariedad[variedad];
  const estado = calcularEstado(variedad, fechaSiembra);

  if (!etapas) {
    return { estado, diasTranscurridos, porcentajeAvance: 0 };
  }

  const { diaActivo, finProduccion } = etapas;

  // Porcentaje de avance del ciclo
  const porcentajeAvance = diasTranscurridos < 0
    ? 0
    : Math.min(Math.round((diasTranscurridos / finProduccion) * 100), 100);

  // Días restantes para la siguiente etapa
  let diasParaSiguienteEtapa = null;
  let siguienteEtapa = null;

  if (diasTranscurridos < 0) {
    diasParaSiguienteEtapa = Math.abs(diasTranscurridos);
    siguienteEtapa = 'En crecimiento';
  } else if (diasTranscurridos < diaActivo) {
    diasParaSiguienteEtapa = diaActivo - diasTranscurridos;
    siguienteEtapa = 'Activo';
  } else if (diasTranscurridos < finProduccion) {
    diasParaSiguienteEtapa = finProduccion - diasTranscurridos;
    siguienteEtapa = 'Fin de producción';
  }

  return {
    estado,
    diasTranscurridos,
    porcentajeAvance,
    diasParaSiguienteEtapa,
    siguienteEtapa
  };
};