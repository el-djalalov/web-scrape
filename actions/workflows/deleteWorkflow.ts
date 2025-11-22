"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { revalidateWorkflowCache } from "@/lib/cache/revalidate";

export async function DeleteWorkflow(id: string) {
	const session = await auth();
	if (!session) {
		throw new Error("Unauthenticated");
	}
	await prisma.workflow.delete({
		where: {
			id,
			userId: session.user.id,
		},
	});

	// Invalidate both path and cache
	revalidatePath("/workflows");
	await revalidateWorkflowCache(session.user.id);
}
