interface SummaryProps {
	result: number | string | undefined;
}

function Summary({ result }: SummaryProps) {
	return (
		<section>
			<p>{result}</p>
		</section>
	);
}

export { Summary };
