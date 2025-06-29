"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";

export async function RemoveWorkflowSchedule(id: string) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	await prisma.workflow.update({
		where: {
			id,
			userId: session.user.id,
		},
		data: {
			cron: null,
			nextRunAt: null,
		},
	});
	revalidatePath("/workflows");
}
