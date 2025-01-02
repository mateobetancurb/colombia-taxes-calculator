import { useEffect, useState } from "react";
import { currencyFormat } from "../helpers";

interface SummaryProps {
	result: number | string;
}

function Summary({ result }: SummaryProps) {
	const [isValueCopied, setIsValueCopied] = useState<boolean>(false);
	async function copyToClipboard(value: number | string) {
		try {
			if (navigator?.clipboard?.writeText) {
				await navigator.clipboard.writeText(value.toString());
			}
			setIsValueCopied(true);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		setIsValueCopied(false);
	}, [result]);

	return (
		<section className="bg-[#e0fff1] rounded-lg p-5">
			<h2 className="font-bold text-lg text-center mb-3">Impuesto a pagar</h2>
			<p className="text-center">{currencyFormat(result)}</p>
			<button
				type="button"
				onClick={() => copyToClipboard(result)}
				className="bg-[#16803D] text-white font-bold w-full p-2 rounded-lg mt-5"
			>
				{!isValueCopied ? "Copiar valor 🔖" : "Copiado ✅"}
			</button>
		</section>
	);
}

export { Summary };
