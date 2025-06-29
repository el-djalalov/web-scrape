"use server";

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function UnPublishWorkflow(id: string) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	const worfkow = await prisma.workflow.findUnique({
		where: {
			id,
			userId: session.user.id,
		},
	});

	if (!worfkow) {
		throw new Error("Workflow not found");
	}

	if (worfkow.status !== WorkflowStatus.PUBLISHED) {
		throw new Error("Workflow is not published");
	}

	await prisma.workflow.update({
		where: {
			id,
			userId: session.user.id,
		},
		data: {
			status: WorkflowStatus.DRAFT,
			executionPlan: null,
			creditsCost: 0,
		},
	});

	revalidatePath(`/workflow/editor/${id}`);
}
