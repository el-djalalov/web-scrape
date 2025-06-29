"use server";

import prisma from "@/lib/prisma";
import {
	duplicateWorkflowSchema,
	duplicateWorkflowSchemaType,
} from "@/schema/workflows";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function DuplicateWorkflow(form: duplicateWorkflowSchemaType) {
	const { success, data } = duplicateWorkflowSchema.safeParse(form);

	if (!success) {
		throw new Error("Invalid form data");
	}

	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	const sourceWorkflow = await prisma.workflow.findUnique({
		where: { id: data.workflowId, userId: session.user.id },
	});

	if (!sourceWorkflow) {
		throw new Error("Workflow not found");
	}

	const result = await prisma.workflow.create({
		data: {
			userId: session.user.id,
			name: data.name,
			description: data.description,
			status: WorkflowStatus.DRAFT,
			defination: sourceWorkflow.defination,
		},
	});

	if (!result) {
		throw new Error("Failed to duplicate workflow");
	}

	revalidatePath("/workflows");
}
