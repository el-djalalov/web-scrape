function convertToSubCurrency(amount: number, subCurrencyFactor = 100): number {
	console.log("Converting amount to sub-currency:", amount);

	return Math.round(amount * subCurrencyFactor);
}

export default convertToSubCurrency;
