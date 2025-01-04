function Footer() {
	const date = new Date();
	const currentYear = date.getFullYear();

	return (
		<p className="mt-auto text-sm w-full text-center py-3">
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
	);
}

export { Footer };
