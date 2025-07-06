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

export const CreditsPacks: CreditsPack[] = [
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
		label: "2500 credits",
		credits: 2500,
		price: 1999, // $19.99
	},

	{
		id: PackId.LARGE,
		name: "Large pack",
		label: "5000 credits",
		credits: 5000,
		price: 2999, // $29.99
	},
];

export const getCreditsPack = (id: PackId) => {
	return CreditsPacks.find(p => p.id === id);
};
