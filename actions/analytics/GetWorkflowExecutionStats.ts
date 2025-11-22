"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@/auth";

import { eachDayOfInterval } from "date-fns";
import { format } from "date-fns";
import { cache } from "react";

type Stats = Record<string, { success: number; failed: number }>;

// Use React.cache() for request memoization
const getWorkflowExecutionsFromDb = cache(
	async (userId: string, startDate: Date, endDate: Date) => {
		return prisma.workflowExecution.findMany({
			where: {
				userId,
				startedAt: {
					gte: startDate,
					lte: endDate,
				},
			},
		});
	}
);

export async function GetWorkflowExecutionStats(period: Period) {
	const session = await auth();

	if (!session || !session.user) {
		return;
	}

	const dateRange = PeriodToDateRange(period);

	const executions = await getWorkflowExecutionsFromDb(
		session.user.id,
		dateRange.startDate,
		dateRange.endDate
	);

	const dateFormat = "yyyy-MM-dd";

	const stats: Stats = eachDayOfInterval({
		start: dateRange.startDate,
		end: dateRange.endDate,
	})
		.map(date => format(date, "yyyy-MM-dd"))
		.reduce((acc, date) => {
			acc[date] = {
				success: 0,
				failed: 0,
			};
			return acc;
		}, {} as any);

	executions.forEach(execution => {
		const date = format(execution.startedAt!, dateFormat);

		if (execution.status === WorkflowExecutionStatus.COMPLETED) {
			stats[date].success += 1;
		}

		if (execution.status === WorkflowExecutionStatus.FAILED) {
			stats[date].failed += 1;
		}
	});

	const result = Object.entries(stats).map(([date, infos]) => ({
		date,
		...infos,
	}));

	return result;
}
