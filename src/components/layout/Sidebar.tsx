import { memo } from "react";
import { BarChart3, Calculator, FileDown, Save } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { acciones, barraLateral, navegacion } from "../../locales/es";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onExportPdf: () => void;
  onSaveSimulation: () => void;
}

const navItems = [
  { label: navegacion.panel, href: "#dashboard", icon: BarChart3 },
  { label: navegacion.calculadora, href: "#calculator", icon: Calculator },
  { label: navegacion.resultados, href: "#results", icon: BarChart3 },
  { label: navegacion.historial, href: "#history", icon: Save },
];

function Sidebar({ isOpen, onClose, onExportPdf, onSaveSimulation }: SidebarProps) {
  return (
    <>
      <div
        className={cn("fixed inset-0 z-20 bg-slate-950/50 lg:hidden", isOpen ? "block" : "hidden")}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 transform border-r border-slate-200 bg-white p-6 transition-transform dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label={navegacion.principal}
      >
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.15em] text-emerald-600">
            {barraLateral.subtitulo}
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {barraLateral.titulo}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {barraLateral.descripcion}
          </p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-10 space-y-3">
          <Button onClick={onExportPdf} className="w-full justify-start gap-3">
            <FileDown className="h-4 w-4" />
            {acciones.exportarPdf}
          </Button>
          <Button
            onClick={onSaveSimulation}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            <Save className="h-4 w-4" />
            {acciones.guardarSimulacion}
          </Button>
        </div>
      </aside>
    </>
  );
}

const MemoizedSidebar = memo(Sidebar);

export { MemoizedSidebar as Sidebar };
