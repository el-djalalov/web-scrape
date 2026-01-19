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
	WorkflowStatus,
} from "@/types/workflow";
import { auth } from "@/auth";
import { safeJsonParse } from "@/lib/utils/safeJsonParse";
import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";

export async function RunWorkFlow(form: {
	workflowId: string;
	flowDefination?: string;
}) {
	const session = await auth();

	if (!session) {
		throw new Error("Unauthenticated");
	}

	const { workflowId, flowDefination } = form;

	if (!workflowId) {
		throw new Error("Workflow id is required");
	}

	const workflow = await prisma.workflow.findUnique({
		where: {
			userId: session.user.id,
			id: workflowId,
		},
	});

	if (!workflow) {
		throw new Error("Workflow is not found");
	}

	let executionPlan: WorkflowExecutionPlan;
	let workflowDefination = flowDefination;

	if (workflow.status === WorkflowStatus.PUBLISHED) {
		if (!workflow.executionPlan) {
			throw new Error("No execution plan found in published workflow");
		}
		const parsedPlan = safeJsonParse<WorkflowExecutionPlan>(workflow.executionPlan);
		if (!parsedPlan) {
			throw new Error("Failed to parse execution plan");
		}
		executionPlan = parsedPlan;
		workflowDefination = workflow.defination;
	} else {
		// Workflow is a draft
		if (!flowDefination) {
			throw new Error("Flow defination is not defined");
		}
		const flow = safeJsonParse<{ nodes: AppNode[]; edges: Edge[] }>(flowDefination);
		if (!flow) {
			throw new Error("Failed to parse flow definition");
		}
		const result = FlowToExecutionPlan(flow.nodes, flow.edges);
		if (result.error) {
			throw new Error("Flow defination was not valid");
		}

		if (!result.executionPlan) {
			throw new Error("No execution plan was generated");
		}

		executionPlan = result.executionPlan;
	}

	const execution = await prisma.workflowExecution.create({
		data: {
			workflowId,
			userId: session.user.id,
			status: WorkflowExecutionStatus.PENDING,
			startedAt: new Date(),
			trigger: WorkflowExecutionTrigger.MANUAL,
			definition: workflowDefination,
			phases: {
				create: executionPlan.flatMap(phase => {
					return phase.nodes.flatMap(node => {
						return {
							userId: session.user.id,
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

	// Trigger workflow execution via internal API endpoint
	// This is more reliable than setTimeout in serverless environments
	triggerWorkflowExecution(execution.id);

	return { redirectUrl: `/workflow/runs/${workflowId}/${execution.id}` };
}

/**
 * Triggers workflow execution asynchronously via the internal API.
 * Uses fetch to call the execute endpoint, which allows the server action
 * to return immediately while execution continues in the background.
 */
function triggerWorkflowExecution(executionId: string) {
	const executeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/workflows/execute`;

	fetch(executeUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.API_SECRET}`,
		},
		body: JSON.stringify({ executionId }),
	}).catch(error => {
		console.error("Failed to trigger workflow execution:", error);
	});
}
