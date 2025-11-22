"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@/auth";
import { cache } from "react";
import { unstable_cache } from "next/cache";

// Use React.cache() for request memoization
// Prevents redundant database queries within the same request
const getStatsFromDb = cache(
	async (
		userId: string,
		startDate: Date,
		endDate: Date,
		statuses: string[]
	) => {
		const getCachedStats = unstable_cache(
			async () => {
				return prisma.workflowExecution.findMany({
					where: {
						userId,
						startedAt: {
							gte: startDate,
							lte: endDate,
						},
						status: {
							in: statuses,
						},
					},
					select: {
						creditsConsumed: true,
						phases: {
							where: {
								creditsConsumed: {
									not: null,
								},
							},
							select: { creditsConsumed: true },
						},
					},
				});
			},
			[
				"stats-cards",
				userId,
				startDate.toISOString(),
				endDate.toISOString(),
			],
			{
				tags: [`stats-${userId}`, "analytics"],
				revalidate: 300, // Revalidate every 5 minutes
			}
		);

		return getCachedStats();
	}
);

export default async function GetStatsCardsValues(period: Period) {
	const session = await auth();

	if (!session || !session.user) {
		return;
	}

	const { COMPLETED, FAILED } = WorkflowExecutionStatus;

	const dateRange = PeriodToDateRange(period);

	const executions = await getStatsFromDb(
		session.user.id,
		dateRange.startDate,
		dateRange.endDate,
		[COMPLETED, FAILED]
	);

	const stats = {
		workflowExecutions: executions.length,
		creditsConsumed: 0,
		phaseExecutions: 0,
	};

	stats.creditsConsumed = executions.reduce(
		(sum: any, execution: { creditsConsumed: any }) =>
			sum + execution.creditsConsumed,
		0
	);

	stats.phaseExecutions = executions.reduce(
		(sum: any, execution: { phases: string | any[] }) =>
			sum + execution.phases.length,
		0
	);

	return stats;
}
