function convertToSubCurrency(amount: number, subCurrencyFactor = 100): number {
	return Math.round(amount * subCurrencyFactor);
}

export default convertToSubCurrency;
