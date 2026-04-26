export const acciones = {
  exportarPdf: "Exportar PDF",
  guardarSimulacion: "Guardar simulación",
  guardado: "Guardado",
} as const;

export const navegacion = {
  principal: "Navegación principal",
  panel: "Panel",
  calculadora: "Calculadora",
  resultados: "Resultados",
  historial: "Historial",
} as const;

export const encabezado = {
  abrirMenu: "Abrir menú de navegación",
  alternarTema: "Cambiar modo oscuro",
  etiquetaUvt: "UVT 2026",
} as const;

export const barraLateral = {
  subtitulo: "TaxFlow",
  titulo: "TaxFlow 2026",
  descripcion: "Simulador de impuestos en Colombia",
} as const;

export const app = {
  seccionPanel: "Panel",
  vistaFinanciera: "Vista general financiera",
  contextoPerfil: "Contexto del perfil",
  contextoPerfilDescripcion: "Resumen rápido de la simulación actual.",
  calculadoraActiva: "Calculadora activa",
  disclaimerContador: "Usa el simulador como orientación y valida la declaración final con tu contador.",
  historialTitulo: "Historial local",
  historialDescripcion: "Guarda y recupera perfiles sin crear base de datos.",
  historialVacio: "No hay simulaciones guardadas por ahora.",
  restaurar: "Restaurar",
  eliminar: "Eliminar",
} as const;

export const calculadora = {
  titulo: "Calculadora de impuestos",
  descripcion: "Selecciona un módulo tributario 2026 e ingresa valores en COP.",
} as const;

export const panelResultados = {
  titulo: "Resultados",
  descripcion: "Desglose de la simulación del módulo activo.",
  formula: "Fórmula aplicada",
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
  descripcion: "Visualiza componentes principales y balance impuestos vs disponible.",
  ingresoDisponible: "Ingreso disponible",
  impuestos: "Impuestos y aportes",
  rentaExentaYDeducciones: "Renta exenta y deducciones",
  retencion: "Retención en la fuente",
  seguridadSocial: "Seguridad social",
} as const;

export function formatDateLabel(isoDate: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}
