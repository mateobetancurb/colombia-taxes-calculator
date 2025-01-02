interface SummaryProps {
	result: number | string;
}

function Summary({ result }: SummaryProps) {
	return (
		<section>
			<p>{result}</p>
		</section>
	);
}

export { Summary };
