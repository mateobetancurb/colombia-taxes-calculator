import { currencyFormat } from "../helpers";

interface SummaryProps {
	result: number | string;
}

function Summary({ result }: SummaryProps) {
	return (
		<section className="bg-[#e0fff1] rounded-lg p-5">
			<h2 className="font-bold text-lg text-center mb-3">Impuesto a pagar</h2>
			<p className="text-center">{currencyFormat(result)}</p>
		</section>
	);
}

export { Summary };
