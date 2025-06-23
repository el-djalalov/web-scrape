import HomeClient from "./HomeClient";
import { GetPeriods } from "@/actions/analytics/getPeriods";
import GetStatsCardsValues from "@/actions/analytics/getStatsCards";
import { GetWorkflowExecutionStats } from "@/actions/analytics/GetWorkflowExecutionStats";
import { GetCreditsUsage } from "@/actions/analytics/GetCreditUsage";

export default async function Home({
	searchParams,
}: {
	searchParams: {
		month?: string;
		year?: string;
		paymentSuccess?: string;
		amount?: string;
	};
}) {
	const currentDate = new Date();
	const period = {
		month: searchParams.month
			? parseInt(searchParams.month)
			: currentDate.getMonth(),
		year: searchParams.year
			? parseInt(searchParams.year)
			: currentDate.getFullYear(),
	};

	const periods = await GetPeriods();
	const statsCardsData = await GetStatsCardsValues(period);
	const executionStatsData = await GetWorkflowExecutionStats(period);
	const creditsUsageData = await GetCreditsUsage(period);

	return (
		<HomeClient
			searchParams={searchParams}
			periods={periods}
			statsCardsData={statsCardsData}
			executionStatsData={executionStatsData}
			creditsUsageData={creditsUsageData}
			period={period}
		/>
	);
}
