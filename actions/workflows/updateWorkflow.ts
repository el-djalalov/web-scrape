"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { revalidateWorkflowCache } from "@/lib/cache/revalidate";

export async function UpdateWorkflow({
	id,
	defination,
}: {
	id: string;
	defination: string;
}) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	const workflow = await prisma.workflow.findUnique({
		where: {
			id,
			userId: session.user.id,
		},
	});

	if (!workflow) {
		throw new Error("Workflow not found");
	}

	if (workflow.status !== WorkflowStatus.DRAFT) {
		throw new Error("Workflow is not a draft");
	}

	await prisma.workflow.update({
		data: {
			defination,
		},
		where: {
			id,
			userId: session.user.id,
		},
	});

	revalidatePath("/workflows");
	await revalidateWorkflowCache(session.user.id);
}
