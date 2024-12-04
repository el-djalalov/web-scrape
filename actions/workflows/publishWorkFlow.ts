"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { CalculateWorkflowCost } from "@/lib/workflow/helpers";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function PublishWorkFlow({
	id,
	flowDefination,
}: {
	id: string;
	flowDefination: string;
}) {
	const { userId } = await auth();
	if (!userId) {
		throw new Error("Unauthenticated");
	}

	const workflow = await prisma.workflow.findUnique({
		where: {
			id,
			userId,
		},
	});

	if (!workflow) {
		throw new Error("Workflow not found");
	}

	if (workflow.status !== WorkflowStatus.DRAFT) {
		throw new Error("Workflow is not a draft");
	}

	const flow = JSON.parse(flowDefination);
	const result = FlowToExecutionPlan(flow.nodes, flow.edges);

	if (result.error) {
		throw new Error("Flow defination is not valid");
	}
	if (!result.executionPlan) {
		throw new Error("No execution plan generated");
	}

	const creditsCost = CalculateWorkflowCost(flow.nodes);

	await prisma.workflow.update({
		where: {
			id,
			userId,
		},
		data: {
			defination: flowDefination,
			executionPlan: JSON.stringify(result.executionPlan),
			creditsCost,
			status: WorkflowStatus.PUBLISHED,
		},
	});

	revalidatePath(`/workflow/editor/${id}`);
}
