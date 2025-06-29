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
	};
}) {
	const currentDate = new Date();

	// Await the searchParams
	const params = await searchParams;

	const period = {
		month: params?.month ? parseInt(params.month) : currentDate.getMonth(),
		year: params?.year ? parseInt(params.year) : currentDate.getFullYear(),
	};

	try {
		const periods = await GetPeriods();
		const statsCardsData = await GetStatsCardsValues(period);
		const executionStatsData = await GetWorkflowExecutionStats(period);
		const creditsUsageData = await GetCreditsUsage(period);

		const defaultStatsCardsData = {
			workflowExecutions: 0,
			phaseExecutions: 0,
			creditsConsumed: 0,
		};

		return (
			<HomeClient
				periods={periods}
				statsCardsData={statsCardsData ?? defaultStatsCardsData}
				executionStatsData={executionStatsData}
				creditsUsageData={creditsUsageData}
				period={period}
			/>
		);
	} catch (error) {
		console.error("Error fetching data for Home page:", error);
		return <div>Error loading page. Please try again later.</div>;
	}
}
