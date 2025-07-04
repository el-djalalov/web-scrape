import HomeClient from "./HomeClient";
import { GetPeriods } from "@/actions/analytics/getPeriods";
import GetStatsCardsValues from "@/actions/analytics/getStatsCards";
import { GetWorkflowExecutionStats } from "@/actions/analytics/GetWorkflowExecutionStats";
import { GetCreditsUsage } from "@/actions/analytics/GetCreditUsage";
import { SessionProvider } from "next-auth/react";
interface SearchParams {
	month?: string;
	year?: string;
}

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const currentDate = new Date();

	const params = await searchParams;

	const period = {
		month: params?.month ? parseInt(params.month) : currentDate.getMonth() + 1,
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
			<SessionProvider>
				<HomeClient
					periods={periods}
					statsCardsData={statsCardsData ?? defaultStatsCardsData}
					executionStatsData={executionStatsData}
					creditsUsageData={creditsUsageData}
					period={period}
				/>
			</SessionProvider>
		);
	} catch (error) {
		console.error("Error fetching data for Home page:", error);
		return <div>Error loading page. Please try again later.</div>;
	}
}
