"use client";

import { Period } from "@/types/analytics";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const monthsNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export default function PeriodSelector({
	periods,
	selectedPeriod,
	onPeriodChange,
}: {
	periods: Period[];
	selectedPeriod: Period;
	onPeriodChange: (period: Period) => void;
}) {
	return (
		<Select
			value={`${selectedPeriod.month}-${selectedPeriod.year}`}
			onValueChange={value => {
				const [month, year] = value.split("-");
				onPeriodChange({ month: parseInt(month), year: parseInt(year) });
			}}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{periods.map((period, index) => (
					<SelectItem key={index} value={`${period.month}-${period.year}`}>
						{`${monthsNames[period.month]} ${period.year}`}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
