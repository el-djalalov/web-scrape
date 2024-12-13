import { GetPeriods } from "@/actions/analytics/getPeriods";
import React, { Suspense } from "react";
import PeriodSelector from "./_components/PeriodSelector";
import { Period } from "@/types/analytics";

function Home({
	searchParams,
}: {
	searchParams: { month?: string; year?: string };
}) {
	const currentDate = new Date();
	const { month, year } = searchParams;

	const period: Period = {
		month: month ? parseInt(month) : currentDate.getMonth(),
		year: year ? parseInt(year) : currentDate.getFullYear(),
	};
	return (
		<div>
			{JSON.stringify(period)}
			<Suspense>
				<PeriodSelectorWrapper />
			</Suspense>
		</div>
	);
}

async function PeriodSelectorWrapper() {
	const periods = await GetPeriods();

	return <PeriodSelector periods={periods} />;
}
export default Home;
