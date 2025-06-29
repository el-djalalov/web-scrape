"use server";

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createWorkFlow";
import {
	createWorkflowSchema,
	createWorkflowSchemaType,
} from "@/schema/workflows";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@/auth";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
	const { success, data } = createWorkflowSchema.safeParse(form);
	if (!success) {
		throw new Error("Invalid form data");
	}
	const session = await auth();

	if (!session || !session.user) {
		return;
	}

	const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
		nodes: [],
		edges: [],
	};

	initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

	const result = await prisma.workflow.create({
		data: {
			userId: session.user.id,
			status: WorkflowStatus.DRAFT,
			defination: JSON.stringify(initialFlow),
			...data,
		},
	});

	if (!result) {
		throw new Error("Failed to create workflow");
	}

	redirect(`/workflow/editor/${result.id}`);
}
