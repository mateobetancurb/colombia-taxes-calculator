export const acciones = {
  exportarPdf: "Descargar PDF",
  exportarJson: "Descargar JSON",
  guardarSimulacion: "Guardar en historial",
  guardado: "Guardado",
} as const;

export const navegacion = {
  principal: "Navegación principal",
  panel: "Panorama",
  calculadora: "Calculadora",
  resultados: "Resultados",
  historial: "Historial",
} as const;

export const encabezado = {
  abrirMenu: "Abrir menú principal",
  alternarTema: "Alternar tema claro u oscuro",
  etiquetaUvt: "UVT 2026",
} as const;

export const barraLateral = {
  subtitulo: "TaxFlow Colombia 2026",
  titulo: "Simulador tributario para Colombia",
  descripcion:
    "Proyecta retención, aportes, IVA e impuestos clave en minutos para tomar decisiones con más claridad.",
} as const;

export const app = {
  seccionPanel: "Panorama financiero",
  vistaFinanciera: "Planifica tus impuestos con escenarios claros",
  vistaFinancieraDescripcion:
    "Compara escenarios tributarios 2026 para estimar retenciones, aportes y flujo neto sin hojas de cálculo complejas. Elige un módulo, ajusta valores en COP y guarda tus simulaciones para revisarlas después.",
  seccionCalculadora: "Módulos de simulación",
  seccionResultados: "Resultado del escenario",
  seccionHistorial: "Historial de simulaciones",
  contextoPerfil: "Contexto del escenario",
  contextoPerfilDescripcion: "Resumen rápido para validar tu simulación actual.",
  calculadoraActiva: "Módulo activo",
  cargandoGrafico: "Cargando visualización...",
  nombreCalculadora: "Nombre del escenario",
  nombreCalculadoraPlaceholder: "Escenario abril 2026",
  disclaimerContador:
    "Este simulador es informativo. Antes de declarar, valida el resultado con tu contador o asesor tributario.",
  historialTitulo: "Historial local",
  historialDescripcion: "Guarda y recupera escenarios sin crear una base de datos.",
  historialVacio: "Aún no tienes simulaciones guardadas.",
  restaurar: "Restaurar",
  eliminar: "Eliminar",
  reiniciarSimulacionActual: "Reiniciar simulación actual",
  reiniciarSimulacionActualDescripcion:
    "Si quieres arrancar de cero, restablece los campos del escenario activo sin afectar el historial.",
  eliminarTodoHistorial: "Eliminar todo el historial",
  confirmarEliminarHistorialTitulo: "Eliminar historial completo",
  confirmarEliminarHistorialDescripcion:
    "Esta acción eliminará todas las simulaciones guardadas en este dispositivo. No se puede deshacer.",
  confirmarReiniciarSimulacionTitulo: "Reiniciar simulación actual",
  confirmarReiniciarSimulacionDescripcion:
    "Se limpiarán los datos del escenario actual y volverás al estado inicial del módulo por defecto.",
  cancelar: "Cancelar",
  confirmarEliminar: "Sí, eliminar",
  confirmarReiniciar: "Sí, reiniciar",
} as const;

export const calculadora = {
  titulo: "Calculadora tributaria",
  descripcion: "Selecciona un módulo 2026 e ingresa valores en COP para simular tu escenario.",
} as const;

export const panelResultados = {
  titulo: "Resultado",
  descripcion: "Desglose del módulo activo con supuestos y cifras clave.",
  formula: "Método de cálculo",
  baseGravable: "Base gravable",
  baseUvt: "Base en UVT",
  supuestos: "Supuestos y notas",
} as const;

export const resumen = {
  baseReferencia: "Base de referencia",
  retencion: "Retención en la fuente",
  seguridadSocial: "Seguridad social",
  ingresoNeto: "Ingreso neto",
} as const;

export const grafico = {
  titulo: "Distribución y comparativo",
  descripcion: "Visualiza el peso de cada componente y compara impuestos frente al disponible.",
  ingresoDisponible: "Ingreso disponible",
  impuestos: "Impuestos y aportes",
  rentaExentaYDeducciones: "Renta exenta y deducciones",
  retencion: "Retención en la fuente",
  seguridadSocial: "Seguridad social",
} as const;

export const piePagina = {
  desarrolladoPor: "Creado por",
} as const;

const dateLabelFormatter = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateLabel(isoDate: string): string {
  return dateLabelFormatter.format(new Date(isoDate));
}
