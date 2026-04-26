import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { UVT_2026, formatCopCurrency } from "../../helpers";
import { encabezado } from "../../locales/es";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSidebar: () => void;
}

function Header({ isDark, onToggleTheme, onOpenSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/80 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onOpenSidebar}
            aria-label={encabezado.abrirMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {encabezado.etiquetaUvt}
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatCopCurrency(UVT_2026)}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onToggleTheme}
          aria-label={encabezado.alternarTema}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}

export { Header };
