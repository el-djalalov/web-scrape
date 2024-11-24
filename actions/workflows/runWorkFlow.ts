"use server";

import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
	ExecutionPhaseStatus,
	WorkflowExecutionPlan,
	WorkflowExecutionStatus,
	WorkflowExecutionTrigger,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function RunWorkFlow(form: {
	workflowId: string;
	flowDefination?: string;
}) {
	const { userId } = await auth();

	if (!userId) {
		throw new Error("Unauthenticated");
	}

	const { workflowId, flowDefination } = form;

	if (!workflowId) {
		throw new Error("Workdlow id is required");
	}

	const worfkow = await prisma.workflow.findUnique({
		where: {
			userId,
			id: workflowId,
		},
	});

	if (!worfkow) {
		throw new Error("Workflow is not found");
	}
	let executionPlan: WorkflowExecutionPlan;

	if (!flowDefination) {
		throw new Error("Flow defination is not defined");
	}

	const flow = JSON.parse(flowDefination);
	const result = FlowToExecutionPlan(flow.nodes, flow.edges);
	if (result.error) {
		throw new Error("Flow defination was not valid");
	}

	if (!result.executionPlan) {
		throw new Error("No execution plan was generated");
	}

	executionPlan = result.executionPlan;

	const execution = await prisma.workflowExecution.create({
		data: {
			workflowId,
			userId,
			status: WorkflowExecutionStatus.PENDING,
			startedAt: new Date(),
			trigger: WorkflowExecutionTrigger.MANUAL,
			definition: flowDefination,
			phases: {
				create: executionPlan.flatMap(phase => {
					return phase.nodes.flatMap(node => {
						return {
							userId,
							status: ExecutionPhaseStatus.CREATED,
							number: phase.phase,
							node: JSON.stringify(node),
							name: TaskRegistry[node.data.type].label,
						};
					});
				}),
			},
		},
		select: {
			id: true,
			phases: true,
		},
	});

	if (!execution) {
		throw new Error("Workflow execution was not created");
	}

	ExecuteWorkflow(execution.id); // Run this on background

	redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
