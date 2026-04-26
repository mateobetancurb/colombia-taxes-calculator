function Footer() {
  const date = new Date();
  const currentYear = date.getFullYear();

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

export { Footer };
