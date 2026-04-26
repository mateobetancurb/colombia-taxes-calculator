const copCurrencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const copNumberFormatter = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const numberFormatterCache = new Map<number, Intl.NumberFormat>();

export const formatCopCurrency = (value: number) => {
  return copCurrencyFormatter.format(Math.max(0, value || 0));
};

export const formatPercentageValue = (value: number) => {
  return `${copNumberFormatter.format(Math.max(0, value || 0))}%`;
};

export const formatCopInput = (value: number) => {
  if (!value) {
    return "";
  }

  return `$ ${copNumberFormatter.format(Math.max(0, value))}`;
};

export const parseCopInput = (value: string) => {
  const digitsOnly = value.replace(/[^\d]/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
};

export const formatNumber = (value: number, fractionDigits = 2) => {
  let formatter = numberFormatterCache.get(fractionDigits);
  if (!formatter) {
    formatter = new Intl.NumberFormat("es-CO", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    numberFormatterCache.set(fractionDigits, formatter);
  }
  return formatter.format(value);
};

export const currencyFormat = (value: number | string) => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  return formatCopCurrency(Number.isNaN(numericValue) ? 0 : numericValue);
};
