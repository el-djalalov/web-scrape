"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";

export async function GetWorkflowExecutionWithPhases(executionId: string) {
	const session = await auth();
	if (!session) {
		throw new Error("Unauthenticated");
	}

	const workflowExecution = await prisma.workflowExecution.findUnique({
		where: {
			id: executionId,
			userId: session.user.id,
		},
		include: {
			phases: {
				orderBy: {
					number: "asc",
				},
			},
		},
	});

	if (!workflowExecution) {
		return null;
	}

	const clientSafePhases = workflowExecution.phases.map(phase => {
		const node = JSON.parse(phase.node) as AppNode;
		const taskName = TaskRegistry[node.data.type]?.label || "Unknown Task";
		return {
			id: phase.id,
			status: phase.status,
			number: phase.number,
			name: taskName,
			startedAt: phase.startedAt,
			completedAt: phase.completedAt,
			creditsConsumed: phase.creditsConsumed,
			inputs: phase.inputs,
			outputs: phase.outputs,
		};
	});

	return {
		...workflowExecution,
		phases: clientSafePhases,
	};
}
