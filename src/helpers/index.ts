export const currencyFormat = (value: number | string) => {
	return value.toLocaleString("es-CO", {
		style: "currency",
		currency: "COP",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
};
