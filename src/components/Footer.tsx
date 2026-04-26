import { memo } from "react";
import { piePagina } from "../locales/es";

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <footer className="mt-auto w-full py-3 text-center text-sm">
      <p>
        {piePagina.desarrolladoPor}{" "}
        <a
          href="https://www.linkedin.com/in/mateobetancurb"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Mateo
        </a>{" "}
        © {currentYear}
      </p>
      <p className="mt-1">
        Proyecto open source. Contribuye en{" "}
        <a
          href="https://github.com/mateobetancurb/colombia-taxes-calculator"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          GitHub
        </a>
        .
      </p>
    </footer>
  );
}

const MemoizedFooter = memo(Footer);
export { MemoizedFooter as Footer };
