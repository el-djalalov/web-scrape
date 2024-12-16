export enum PackId {
	SMALL = "SMALL",
	MEDIUM = "MEDIUM",
	LARGE = "LARGE",
}

export type CreditsPack = {
	id: PackId;
	name: string;
	label: string;
	credits: number;
	price: number;
};

export const CreditsPack: CreditsPack[] = [
	{
		id: PackId.SMALL,
		name: "Small pack",
		label: "1000 credits",
		credits: 1000,
		price: 999, // $9.99
	},

	{
		id: PackId.MEDIUM,
		name: "Medium pack",
		label: "5000 credits",
		credits: 5000,
		price: 3999, // $39.99
	},

	{
		id: PackId.LARGE,
		name: "Large pack",
		label: "10000 credits",
		credits: 10000,
		price: 6999, // $69.99
	},
];

export const getCreditsPack = (id: PackId) => {
	CreditsPack.find(p => p.id === id);
};
