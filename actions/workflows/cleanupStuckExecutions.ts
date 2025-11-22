"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { WorkflowExecutionStatus } from "@/types/workflow";

export async function CleanupStuckExecutions() {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	// Find all executions that are stuck in RUNNING status for more than 1 hour
	const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

	const stuckExecutions = await prisma.workflowExecution.findMany({
		where: {
			userId: session.user.id,
			status: WorkflowExecutionStatus.RUNNING,
			startedAt: {
				lt: oneHourAgo,
			},
		},
	});

	if (stuckExecutions.length === 0) {
		return { success: true, count: 0 };
	}

	// Update all stuck executions to FAILED
	await prisma.workflowExecution.updateMany({
		where: {
			id: {
				in: stuckExecutions.map(e => e.id),
			},
		},
		data: {
			status: WorkflowExecutionStatus.FAILED,
			completedAt: new Date(),
		},
	});

	// Update workflows that have these as their last run
	for (const execution of stuckExecutions) {
		await prisma.workflow.updateMany({
			where: {
				id: execution.workflowId,
				lastRunId: execution.id,
			},
			data: {
				lastRunStatus: WorkflowExecutionStatus.FAILED,
			},
		});
	}

	return { success: true, count: stuckExecutions.length };
}
