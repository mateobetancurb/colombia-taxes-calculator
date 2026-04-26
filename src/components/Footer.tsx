import { memo } from "react";

const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <footer className="mt-auto w-full py-3 text-center text-sm">
      <p>
        Desarrollado por{" "}
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
