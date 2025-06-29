"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GetWorkflowExecutionWithPhases(executionId: string) {
	const session = await auth();
	if (!session) {
		throw new Error("Unauthenticated");
	}

	return prisma.workflowExecution.findUnique({
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
}
