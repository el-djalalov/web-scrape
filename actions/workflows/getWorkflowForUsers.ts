"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GetWorkflowForUsers() {
	const session = await auth();
	if (!session) {
		throw new Error("Unauthenticated");
	}
	return prisma.workflow.findMany({
		where: {
			userId: session.user.id,
		},
		orderBy: {
			createdAt: "asc",
		},
	});
}
