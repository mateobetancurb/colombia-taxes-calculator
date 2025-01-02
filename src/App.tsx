import { useState } from "react";

function App() {
	const [displayValue, setDisplayValue] = useState("");

	const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value.replace(/[^\d]/g, "");
		const formattedValue = rawValue
			? new Intl.NumberFormat("es-CO", {
					style: "currency",
					currency: "COP",
					minimumFractionDigits: 0,
					maximumFractionDigits: 0,
			  }).format(Number(rawValue))
			: "";
		setDisplayValue(formattedValue);
	};

	return (
		<main className="bg-[#e0fff1] h-screen py-10">
			<div className="w-[90%] px-5 md:w-2/3 mx-auto bg-white rounded-lg shadow-lg">
				<div className="flex items-center gap-3 justify-center py-5 mb-5">
					<svg
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-12 text-green-700"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
						/>
					</svg>
					<h1 className="text-xl font-bold text-center">
						Calculadora de impuestos para Colombianos 🇨🇴
					</h1>
				</div>
				<h2 className="mb-5">
					¿No sabes cómo calcular tus impuestos? No te preocupes, esta
					herramienta lo hace todo por ti
				</h2>
				<form action="">
					<label className="block mb-3 font-bold" htmlFor="tax">
						Elige el tipo de impuesto a calcular
					</label>
					<select
						id="tax"
						className="mb-5 w-full p-2 border border-gray-300 rounded-lg"
						defaultValue={"-- Selecciona --"}
					>
						<option disabled>-- Selecciona --</option>
						<option value="">4x1000</option>
						<option value="">Retención en la fuente</option>
						<option value="">IVA</option>
						<option disabled>Próximamente se agregarán nuevos impuestos</option>
					</select>
					<label className="block mb-3 font-bold" htmlFor="value">
						Valor a calcular
					</label>
					<input
						id="value"
						type="text"
						inputMode="numeric"
						value={displayValue}
						onChange={handleValueChange}
						placeholder="$ 0"
						className="mb-5 w-full p-2 border border-gray-300 rounded-lg"
					/>
				</form>
			</div>
		</main>
	);
}

export default App;
