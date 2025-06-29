"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GetWorkflowPhaseDetails(phaseId: string) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	return prisma.executionPhase.findUnique({
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
}
