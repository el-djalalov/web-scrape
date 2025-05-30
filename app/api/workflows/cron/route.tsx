import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  WorkflowStatus,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
  WorkflowExecutionPlan,
  ExecutionPhaseStatus,
} from "@/types/workflow";
import parser from "cron-parser";

export async function GET(request: Request) {
  const now = new Date();

  const dueWorkflows = await prisma.workflow.findMany({
    select: {
      id: true,
      cron: true,
      userId: true,
      defination: true,
      executionPlan: true,
    },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  });

  let executionsStarted = 0;

  for (const wf of dueWorkflows) {
    try {
      if (!wf.executionPlan || !wf.cron || !wf.userId) {
        `Workflow ${wf.id} is missing necessary data (executionPlan, cron, or userId). Skipping.`;
        continue;
      }
      const executionPlan = JSON.parse(
        wf.executionPlan
      ) as WorkflowExecutionPlan;
      const cronExpression = parser.parseExpression(wf.cron, { utc: true });
      const nextRunForThisWorkflow = cronExpression.next().toDate();

      const execution = await prisma.workflowExecution.create({
        data: {
          workflowId: wf.id,
          userId: wf.userId,
          definition: wf.defination,
          status: WorkflowExecutionStatus.PENDING,
          startedAt: new Date(),
          trigger: WorkflowExecutionTrigger.CRON,
          phases: {
            create: executionPlan.flatMap((phase) => {
              return phase.nodes.flatMap((node) => {
                if (!TaskRegistry[node.data.type]) {
                  console.warn(
                    `Task type ${node.data.type} not found in registry. Skipping node execution.`
                  );
                  return [];
                }
                return {
                  userId: wf.userId!,
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

      ExecuteWorkflow(execution.id, nextRunForThisWorkflow);
      executionsStarted++;

      await prisma.workflow.update({
        where: { id: wf.id },
        data: { nextRunAt: nextRunForThisWorkflow },
      });
    } catch (error) {}
  }

  return Response.json(
    {
      message: `Processed ${dueWorkflows.length} due workflows. Started ${executionsStarted} executions.`,
      workflowsToRunCount: dueWorkflows.length,
    },
    { status: 200 }
  );
}
