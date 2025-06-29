"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GetWorkflowExecutions(workflowId: string) {
	const session = await auth();
	if (!session) {
		throw new Error("Unauthenticated");
	}

	return prisma.workflowExecution.findMany({
		where: {
			workflowId,
			userId: session.user.id,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
}
