export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes max for workflow execution

import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import parser from "cron-parser";
import { safeJsonParse } from "@/lib/utils/safeJsonParse";

function isValidSecret(secret: string): boolean {
  const API_SECRET = process.env.API_SECRET;

  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch {
    return false;
  }
}

/**
 * POST handler for triggering execution by executionId.
 * Used by server actions to trigger async workflow execution.
 */
export async function POST(request: Request) {
  const { ExecuteWorkflow } = await import("@/lib/workflow/executeWorkflow");

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = authHeader.split(" ")[1];
  if (!isValidSecret(secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { executionId } = body;

    if (!executionId || typeof executionId !== "string") {
      return Response.json({ error: "executionId is required" }, { status: 400 });
    }

    // Execute the workflow - this will run to completion
    await ExecuteWorkflow(executionId);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error executing workflow:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET handler for cron-triggered workflow execution.
 * Creates a new execution and runs the workflow.
 */
export async function GET(request: Request) {
  const { default: prisma } = await import("@/lib/prisma");
  const { TaskRegistry } = await import("@/lib/workflow/task/registry");
  const { ExecuteWorkflow } = await import("@/lib/workflow/executeWorkflow");

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = authHeader.split(" ")[1];
  if (!isValidSecret(secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const workflowId = searchParams.get("workflowId");
  if (!workflowId) {
    return Response.json({ error: "workflowId is required" }, { status: 400 });
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });

  if (!workflow) {
    return Response.json({ error: "Workflow not found" }, { status: 404 });
  }

  if (!workflow.executionPlan) {
    return Response.json({ error: "No execution plan found" }, { status: 400 });
  }

  const executionPlan = safeJsonParse<WorkflowExecutionPlan>(workflow.executionPlan);
  if (!executionPlan) {
    return Response.json({ error: "Failed to parse execution plan" }, { status: 400 });
  }

  if (!workflow.cron) {
    return Response.json({ error: "No cron schedule found" }, { status: 400 });
  }

  try {
    const cron = parser.parseExpression(workflow.cron, { utc: true });
    const nextRun = cron.next().toDate();

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.defination,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label,
              };
            });
          }),
        },
      },
    });

    await ExecuteWorkflow(execution.id, nextRun);
    return Response.json({ success: true, executionId: execution.id }, { status: 200 });
  } catch (error) {
    console.error("Error executing workflow:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
