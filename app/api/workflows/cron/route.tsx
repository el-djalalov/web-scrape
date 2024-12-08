import { getAppUrl } from "@/lib/helper/appUrl";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";

export async function GET(request: Request) {
	const now = new Date();

	const workflows = await prisma.workflow.findMany({
		select: { id: true },
		where: {
			status: WorkflowStatus.PUBLISHED,
			cron: { not: null },
			nextRunAt: { lte: now },
		},
	});

	for (const workflow of workflows) {
		triggerWorkflow(workflow.id);
	}

	return Response.json({ workflowsToRun: workflows.length }, { status: 200 });
}

function triggerWorkflow(workflowId: string) {
	const triggerApiUrl = getAppUrl(
		`api/workflows/execute?workflowId=${workflowId}`
	);

	console.log("@@TRIGGER URL", triggerApiUrl);

	fetch(triggerApiUrl, {
		headers: {
			Authorization: `Bearer ${process.env.API_SECRET!}`,
		},
		cache: "no-store",
	}).catch(err => {
		console.error(
			"Error triggering workflow with id",
			workflowId,
			": Error => ",
			err
		);
	});
}