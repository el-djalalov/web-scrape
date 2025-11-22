"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { auth } from "@/auth";
import { eachDayOfInterval } from "date-fns";
import { format } from "date-fns";
import { cache } from "react";

type Stats = Record<string, { success: number; failed: number }>;

const { COMPLETED, FAILED } = ExecutionPhaseStatus;

// Use React.cache() for request memoization
const getExecutionPhasesFromDb = cache(
	async (
		userId: string,
		startDate: Date,
		endDate: Date,
		statuses: string[]
	) => {
		return prisma.executionPhase.findMany({
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
		});
	}
);

export async function GetCreditsUsage(period: Period) {
	const session = await auth();

	if (!session || !session.user) {
		return;
	}

	const dateRange = PeriodToDateRange(period);

	const executionsPhases = await getExecutionPhasesFromDb(
		session.user.id,
		dateRange.startDate,
		dateRange.endDate,
		[COMPLETED, FAILED]
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

	executionsPhases.forEach(phase => {
		const date = format(phase.startedAt!, dateFormat);

		if (phase.status === COMPLETED) {
			stats[date].success += phase.creditsConsumed || 0;
		}

		if (phase.status === FAILED) {
			stats[date].failed += phase.creditsConsumed || 0;
		}
	});

	const result = Object.entries(stats).map(([date, infos]) => ({
		date,
		...infos,
	}));

	return result;
}
