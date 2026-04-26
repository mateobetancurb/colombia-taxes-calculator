import type { ProfileType } from "../helpers/tax-calculator";

/** Etiquetas de acciones reutilizadas (barra lateral y panel de resultados) */
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
} as const;

export const encabezado = {
  abrirMenu: "Abrir menú de navegación",
  alternarTema: "Cambiar modo oscuro",
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
  perfilSeleccionado: "Perfil seleccionado",
  tasaSeguridadSocial: "Tasa de seguridad social aplicada",
  disclaimerContador: "Usa el simulador como orientación y valida la declaración final con tu contador.",
} as const;

const etiquetasPerfil: Record<ProfileType, string> = {
  employee: "Empleado",
  freelancer: "Independiente",
};

export function etiquetaPerfil(profile: ProfileType): string {
  return etiquetasPerfil[profile];
}

export const calculadora = {
  titulo: "Calculadora de impuestos",
  descripcion: "Elige tu perfil e ingresa valores mensuales en COP para simular impuestos.",
  empleado: "Empleado",
  independiente: "Independiente",
  tasaEmpleado: "Aplica tasa de seguridad social del 8 %.",
  tasaIndependiente: "Aplica tasa de seguridad social del 16 %.",
  ingresoBruto: "Ingreso bruto mensual",
  rentaExenta: "Renta exenta",
  rentaExentaTooltip: "Renta exenta de retención en la fuente según la norma colombiana.",
  rentaExentaAyuda: "¿Qué es renta exenta?",
  deduccionesEmpleado: "Deducciones (empleado)",
  costosIndependiente: "Costos deducibles (independiente)",
  errorIngreso: "El ingreso bruto debe ser mayor que COP 0.",
  errorRentaExenta: "La renta exenta no puede ser mayor que el ingreso bruto.",
  errorOtraDeduccion: "Este valor no puede ser mayor que el ingreso bruto.",
} as const;

export const panelResultados = {
  titulo: "Resultados",
  descripcion: "Desglose de la simulación de retención para ingresos mensuales.",
  formula: "Retención = (Base en UVT − 95) × 19 %",
  baseGravable: "Base gravable",
  baseUvt: "Base en UVT",
} as const;

export const resumen = {
  totalImpuestos: "Total impuestos",
  retencion: "Retención en la fuente",
  seguridadSocial: "Seguridad social",
  ingresoNeto: "Ingreso neto",
} as const;

export const grafico = {
  titulo: "Distribución del ingreso",
  descripcion: "Cómo se distribuye tu ingreso bruto mensual en la simulación.",
  ingresoDisponible: "Ingreso disponible",
  rentaExentaYDeducciones: "Renta exenta y deducciones",
  retencion: "Retención en la fuente",
  seguridadSocial: "Seguridad social",
} as const;
