"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";

export async function StopExecution(executionId: string) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	const execution = await prisma.workflowExecution.findUnique({
		where: {
			id: executionId,
			userId: session.user.id,
		},
	});

	if (!execution) {
		throw new Error("Execution not found");
	}

	if (execution.status !== WorkflowExecutionStatus.RUNNING) {
		throw new Error("Can only stop running executions");
	}

	await prisma.workflowExecution.update({
		where: {
			id: executionId,
		},
		data: {
			status: WorkflowExecutionStatus.FAILED,
			completedAt: new Date(),
		},
	});

	await prisma.workflow.updateMany({
		where: {
			id: execution.workflowId,
			lastRunId: executionId,
		},
		data: {
			lastRunStatus: WorkflowExecutionStatus.FAILED,
		},
	});

	revalidatePath(`/workflow/runs/${execution.workflowId}`);

	return { success: true };
}
