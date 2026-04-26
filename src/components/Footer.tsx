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
    </footer>
  );
}

const MemoizedFooter = memo(Footer);

export { MemoizedFooter as Footer };
