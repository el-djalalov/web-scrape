"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@/auth";

export default async function GetStatsCardsValues(period: Period) {
	const session = await auth();

	if (!session || !session.user) {
		return;
	}

	const { COMPLETED, FAILED } = WorkflowExecutionStatus;

	const dateRange = PeriodToDateRange(period);

	const executions = await prisma.workflowExecution.findMany({
		where: {
			userId: session.user.id,
			startedAt: {
				gte: dateRange.startDate,
				lte: dateRange.endDate,
			},
			status: {
				in: [COMPLETED, FAILED],
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

	const stats = {
		workflowExecutions: executions.length,
		creditsConsumed: 0,
		phaseExecutions: 0,
	};

	stats.creditsConsumed = executions.reduce(
		(sum, execution) => sum + execution.creditsConsumed,
		0
	);

	stats.phaseExecutions = executions.reduce(
		(sum, execution) => sum + execution.phases.length,
		0
	);

	return stats;
}
