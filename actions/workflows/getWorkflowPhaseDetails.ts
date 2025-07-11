"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";

export async function GetWorkflowPhaseDetails(phaseId: string) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	const phase = await prisma.executionPhase.findUnique({
		where: {
			id: phaseId,
			execution: {
				userId: session.user.id,
			},
		},
		include: {
			logs: {
				orderBy: {
					timestamp: "asc",
				},
			},
		},
	});

	if (!phase) {
		return null;
	}

	const node = JSON.parse(phase.node) as AppNode;
	const taskName = TaskRegistry[node.data.type]?.label || "Unknown Task";

	return {
		...phase,
		name: taskName,
	};
}
