"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({
	id,
	cron,
}: {
	id: string;
	cron: string;
}) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	try {
		const interval = parser.parseExpression(cron, { utc: true });

		await prisma.workflow.update({
			where: { id, userId: session.user.id },
			data: {
				cron,
				nextRunAt: interval.next().toDate(),
			},
		});
	} catch (error: any) {
		throw new Error("Invalid cron expression");
	}
	revalidatePath("/workflows");
}
